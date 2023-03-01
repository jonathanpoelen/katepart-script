/*
    SPDX-FileCopyrightText: 2023 Jonathan Poelen <jonathan.poelen+katescript@gmail.com>

    SPDX-License-Identifier: MIT
*/

#include <QApplication>
#include <QStandardPaths>
#include <QRegularExpression>
#include <KTextEditor/Command>
#include <KTextEditor/Document>
#include <KTextEditor/Editor>
#include <KTextEditor/View>

#include <iostream>
#include <sstream>
#include <vector>

#include "test.hpp"


using namespace KTextEditor;

struct StringBuf : std::stringbuf
{
  using std::stringbuf::stringbuf;

  bool empty() const
  {
    return pbase() == epptr();
  }
};

struct Stream
{
  Stream& operator<<(std::string_view s)
  {
    buffer.insert(buffer.end(), s.data(), s.end());
    return *this;
  }

  Stream& operator<<(char c)
  {
    buffer.push_back(c);
    return *this;
  }

  std::string_view view() const
  {
    return std::string_view(buffer.data(), buffer.size());
  }

  std::vector<char> buffer;
};

struct TestManager
{
  TestManager()
  {
    // do not load user scripts
    QStandardPaths::setTestModeEnabled(true);

    editor = Editor::instance();
    doc = editor->createDocument(nullptr);
    view = doc->createView(nullptr);
  }

  void check(TestCase test);

  void writeDebug()
  {
    if (!debugbuf.empty()) {
      auto s = std::move(debugbuf).str();
      stream << s.c_str();
      s.clear();
      debugbuf.str(std::move(s));
    }
  }

  Editor* editor;
  Document* doc;
  View* view;
  int failureCounter = 0;
  int successCounter = 0;
  QString input;
  QString cmd;
  QString msg;
  Stream stream;
  // debug() catcher
  StringBuf debugbuf{std::ios_base::out};
  bool verbose = true;
  char const* testName = nullptr;
};

struct PosInfo {
  int countLine;
  int lastIndex;
};

PosInfo getCursorInfo(QStringView str)
{
  int n = 0;
  int pos = -1;
  int lastIndex = 0;
  while ((pos = str.indexOf('\n', pos + 1)) != -1) {
    ++n;
    lastIndex = pos + 1;
  }
  return PosInfo{n, lastIndex};
};

void TestManager::check(TestCase test)
{
  input = test.input;

  Cursor cursor(0, 0);
  Range range = Range::invalid();

  if (test.range.open && test.range.close) {
    int pos1 = input.indexOf(test.range.open);
    int pos2 = (pos1 != -1) ? input.indexOf(test.range.close, pos1 + 1) : -1;
    if (pos2 != -1) {
      auto info1 = getCursorInfo(QStringView(input).left(pos1));
      auto info2 = getCursorInfo(QStringView(input).mid(pos1 + info1.lastIndex, pos2));
      info2.countLine += info1.countLine;
      info2.lastIndex += (info2.countLine != info1.countLine) ? pos1 - info1.lastIndex : 1;
      range = Range(
        info1.countLine, pos1 - info1.lastIndex,
        info2.countLine, pos2 - info2.lastIndex
      );
      cursor = (test.cursor == '^') ? range.start() : range.end();
      input.remove(pos2, 1);
      input.remove(pos1, 1);
    }
  }
  else if (test.cursor) {
    int pos = input.indexOf(test.cursor);
    if (pos != -1) {
      auto info = getCursorInfo(QStringView(input).left(pos));
      cursor = Cursor(info.countLine, pos - info.lastIndex);
      view->setCursorPosition(cursor);
      input.remove(pos, 1);
    }
  }

  doc->setText(input);
  view->setSelection(range);
  view->setCursorPosition(cursor);

  auto writeLocation = [&]{
    stream << "\x1b[34m" << test.filename << "\x1b[0m:\x1b[35m" << test.line << "\x1b[0m:0: ";
  };

  auto writeCmd = [&]{
    stream << "`\x1b[32m" << test.cmd << "\x1b[31m`\x1b[0m";
  };

  cmd = test.cmd;

  auto* command = editor->queryCommand(cmd);
  if (!command) {
    ++failureCounter;
    writeLocation();
    stream << "\x1b[31mUnknown command ";
    writeCmd();
    stream << '\n';
    writeDebug();
    return ;
  }

  if (!command->exec(view, cmd, msg)) {
    ++failureCounter;
    writeLocation();
    stream << "\x1b[31mError with ";
    writeCmd();
    stream << ":\n";
    writeDebug();
    stream << "\x1b[31m  msg: " << msg.toStdString()
        << "\x1b[m  input: \x1b[40m" << test.input
        << "\x1b[m\n";
    return ;
  }

  cursor = view->cursorPosition();
  range = view->selectionRange();
  if (!range.isEmpty()) {
    QChar open = test.range.open ? test.range.open : '[';
    QChar close = test.range.close ? test.range.close : ']';
    int newColumn = cursor.column();
    if (cursor.line() == range.start().line() && cursor.column() >= range.start().column()) {
      ++newColumn;
    }
    if (cursor.line() == range.end().line() && cursor.column() >= range.end().column()) {
      ++newColumn;
    }
    cursor.setColumn(newColumn);
    doc->insertText(range.end(), QString::fromRawData(&close, 1));
    doc->insertText(range.start(), QString::fromRawData(&open, 1));
  }
  doc->insertText(cursor, "|");
  auto result = doc->text();

  if (result != test.expected) {
    ++failureCounter;
    writeLocation();
    stream << "\x1b[31mResult differ\n";
    writeCmd();
    stream << ":\n";
    writeDebug();
    stream <<
        "  input:    \x1b[40m" << test.input << "\x1b[0m\n"
        "  output:   \x1b[40m" << result.toStdString() << "\x1b[0m\n"
        "  expected: \x1b[40m" << test.expected << "\x1b[0m\n"
        ;
    return ;
  }

  if (!debugbuf.empty()) {
    if (verbose) {
      writeLocation();
      writeCmd();
      stream << ":\n";
      writeDebug();
    }
    else {
      debugbuf.str(std::string());
    }
  }

  ++successCounter;
};

TestManager* g_testManager;

UnitTest* g_firstUnitTest = nullptr;
UnitTest* g_currentUnitTest = nullptr;

UnitTest::UnitTest(char const* name, void (*fn)())
: fn(fn)
, name(name)
, next(nullptr)
{
  if (g_currentUnitTest) {
    g_currentUnitTest->next = this;
  }
  else {
    g_firstUnitTest = this;
  }
  g_currentUnitTest = this;
}

void check(TestCase test)
{
  g_testManager->check(test);
}

int main(int argc, char** argv)
{
  std::ios::sync_with_stdio(false);

  QApplication app(argc, argv);

  TestManager testManager;
  g_testManager = &testManager;
  bool hasStatus = true;

  int iparam = 1;
  while (argv[iparam] && argv[iparam][0] == '-' && argv[iparam][2] == '\0') {
    if (argv[iparam][1] == 's') {
      hasStatus = false;
      ++iparam;
    }
    else if (argv[iparam][1] == 'S') {
      testManager.verbose = false;
      ++iparam;
    }
    else {
      break;
    }
  }

  char const* patternFilter = argv[iparam];
  QRegularExpression filter(patternFilter ? patternFilter : "", QRegularExpression::DontCaptureOption);

  std::ostream out{std::cerr.rdbuf(&testManager.debugbuf)};

  for (auto* ut = g_firstUnitTest; ut; ut = ut->next) {
    if (hasStatus) {
      out << "\x1b[90m" << ut->name;
    }

    if (!patternFilter || filter.match(ut->name).hasMatch()) {
      auto previousFailureCounter = testManager.failureCounter;
      auto previousTotalCounter = testManager.successCounter + previousFailureCounter;
      ut->fn();
      if (hasStatus) {
        if (previousFailureCounter == testManager.failureCounter) {
          out << "... \x1b[32mOk\x1b[m\n";
        }
        else {
          out << "... \x1b[31mFailure ["
              << (testManager.failureCounter - previousFailureCounter) << '/'
              << (testManager.failureCounter + testManager.successCounter - previousTotalCounter)
              << "]\x1b[m\n"
          ;
        }
      }
    }
    else if (hasStatus) {
      out << "... Skipped\x1b[m\n";
    }

    if (!testManager.stream.buffer.empty()) {
      out << testManager.stream.view();
      testManager.stream.buffer.clear();
    }
  }

  out <<
    "Success: \x1b[32m" << testManager.successCounter << "\x1b[m  "
    "Failure: \x1b[31m" << testManager.failureCounter << "\x1b[m\n"
  ;
  out.flush();

  // detach testManager.debugbuf
  std::cerr.rdbuf(nullptr);

  return testManager.failureCounter ? 1 : 0;
  // return app.exec();
}
