/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: contextNext, contextPrev
 */

/**
 * Move the cursor to the next/previous highlight context
 */

require ("range.js");

function contextNext()
{
  var cursor = view.cursorPosition();
  var attr = document.attribute(cursor);

  var len = document.lineLength(cursor.line);
  var lines = document.lines();

  while (1) {
    if (++cursor.column >= len) {
      if (++cursor.line === lines) {
        return ;
      }
      cursor.column = 0;
      len = document.lineLength(cursor.line);
    }
    if (document.attribute(cursor) != attr) {
      view.setCursorPosition(cursor);
      return ;
    }
  }
}

function contextPrev()
{
  var cursor = view.cursorPosition();

  while (!cursor.column) {
    if (--cursor.line === -1) {
      return ;
    }
    cursor.column = document.lineLength(cursor.line);
  }
  --cursor.column;

  var attr = document.attribute(cursor);

  while (1) {
    while (!cursor.column) {
      if (--cursor.line === -1) {
        return ;
      }
      cursor.column = document.lineLength(cursor.line);
    }
    --cursor.column;
    if (document.attribute(cursor) != attr) {
      ++cursor.column;
      view.setCursorPosition(cursor);
      return ;
    }
  }
}


function help(cmd) {
  if (cmd === 'contextNext') {
    return i18n("Move the cursor to the next highlighting context");
  }
  if (cmd === 'contextNext') {
    return i18n("Move the cursor to the previous highlighting context");
  }
}
