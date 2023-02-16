/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: jumpUnmachingIndentDown, jumpUnmachingIndentUp
 */

/**
 * Move cursor to next/previous unmatching indentation
 */

require("cursor.js");

function jumpUnmachingIndentDown() {
  const cursor = view.cursorPosition();
  const lines = document.lines();
  let line = cursor.line;
  let indentLevel = document.firstColumn(line);

  // empty line, move to next indentation
  if (indentLevel === -1) {
    line = document.nextNonEmptyLine(line + 1);
    // end of document
    if (line === -1) {
      view.setCursorPosition(lines-1, cursor.column);
      return;
    }
    indentLevel = document.firstColumn(line);
  }

  while (++line < lines) {
    const firstColumn = document.firstColumn(line);
    if (firstColumn !== indentLevel && firstColumn !== -1) {
      break;
    }
  }

  if (line === lines) {
    --line;
  }
  view.setCursorPosition(line, cursor.column);
}

function jumpUnmachingIndentUp() {
  const cursor = view.cursorPosition();
  let line = cursor.line;
  let indentLevel = document.firstColumn(line);

  // empty line, move to previous indentation
  if (indentLevel === -1) {
    line = document.prevNonEmptyLine(line - 1);
    indentLevel = document.firstColumn(line);
  }

  while (--line > 0) {
    const firstColumn = document.firstColumn(line);
    if (firstColumn !== indentLevel && firstColumn !== -1) {
      break;
    }
  }

  view.setCursorPosition(line, cursor.column);
}

function help(cmd) {
  if (cmd === 'jumpUnmachingIndentUp') {
    return i18n("Move Cursor to Previous Unmatching Indentation");
  }
  if (cmd === 'jumpUnmachingIndentDown') {
    return i18n("Move Cursor to Next Unmatching Indentation");
  }
}
