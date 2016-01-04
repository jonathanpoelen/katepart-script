/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: jumpParagraphDown, jumpParagraphUp
 */

/**
 * Move cursor to next/previous text or blank paragraph
 */

require ("range.js");

function jumpParagraphDown() {
  var cursor = view.cursorPosition();
  var line = cursor.line;
  var lines = document.lines();

  if (!document.firstChar(line)) {
    line = document.nextNonEmptyLine(line);
  }
  else if (line < lines) {
    ++line;
    while (line < lines && document.firstChar(line)) {
      ++line;
    }
  }

  view.setCursorPosition(line, cursor.column);
}

function jumpParagraphUp() {
  var cursor = view.cursorPosition();
  var line = cursor.line;

  if (!document.firstChar(line)) {
    line = document.prevNonEmptyLine(line);
  }
  else if (line > 0) {
    --line;
    while (line > 0 && document.firstChar(line)) {
      --line;
    }
  }

  view.setCursorPosition(line, cursor.column);
}

function help(cmd) {
  if (cmd === 'jumpParagraphtUp') {
    return i18n("Move cursor to previous text or blank paragraph");
  }
  if (cmd === 'jumpParagraphDown') {
    return i18n("Move cursor to next text or blank paragraph");
  }
}

function action(cmd)
{
  if ('jumpParagraphDown' === cmd)
    return {
      icon: "",
      category: "Navigation",
      interactive: false,
      text: i18n("Move cursor to next text or blank paragraph"),
      shortcut: "Alt+Shift+PgDown"
    };
  if ('jumpParagraphUp' === cmd)
    return {
      icon: "",
      category: "Navigation",
      interactive: false,
      text: i18n("Move cursor to previous text or blank paragraph"),
      shortcut: "Alt+Shift+PgUp"
    };
}

