/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: jumpParagraphDown, jumpParagraphUp
 */

/**
 * Move cursor to next/previous text paragraph
 */

require("range.js");

function jumpParagraphDown() {
  var cursor = view.cursorPosition();
  var line = cursor.line;
  var lines = document.lines();

  if (document.firstChar(line) && line < lines) {
    while (++line < lines && document.firstChar(line)) {
    }
  }

  var new_line = document.nextNonEmptyLine(line);
  if (new_line !== -1) {
    line = new_line;
  }
  view.setCursorPosition(line, cursor.column);
}

function jumpParagraphUp() {
  var cursor = view.cursorPosition();
  var line = cursor.line;

  if (document.firstChar(line) && line > 0) {
    while (--line > 0 && document.firstChar(line)) {
    }
  }

  var new_line = document.prevNonEmptyLine(line);
  if (new_line !== -1) {
    line = new_line;
  }
  view.setCursorPosition(line, cursor.column);
}

function help(cmd) {
  if (cmd === 'jumpParagraphtUp') {
    return i18n("Move cursor to previous text paragraph");
  }
  if (cmd === 'jumpParagraphDown') {
    return i18n("Move cursor to next text paragraph");
  }
}

function action(cmd)
{
  if ('jumpParagraphDown' === cmd)
    return {
      category: "Navigation",
      interactive: false,
      text: i18n("Move cursor to next text paragraph"),
      shortcut: "Alt+Shift+PgDown"
    };
  if ('jumpParagraphUp' === cmd)
    return {
      category: "Navigation",
      interactive: false,
      text: i18n("Move cursor to previous text paragraph"),
      shortcut: "Alt+Shift+PgUp"
    };
}

