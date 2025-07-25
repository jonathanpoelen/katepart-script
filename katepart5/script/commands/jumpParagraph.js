const katescript = {
  "author": "Jonathan Poelen <jonathan.poelen+katescript@gmail.com>",
  "license": "BSD",
  "revision": 2,
  "kate-version": "5.1",
  "functions": [ "jumpParagraphDown", "jumpParagraphUp" ],
  "actions": [
    { "function": "jumpParagraphDown"
    , "name": "Move cursor to next paragraph"
    , "category": "Navigation"
    , "shortcut": "Alt+Shift+PgDown"
    },
    { "function": "jumpParagraphUp"
    , "name": "Move cursor to next paragraph"
    , "category": "Navigation"
    , "shortcut": "Alt+Shift+PgUp"
    }
  ]
};

/**
 * Move cursor to next/previous text paragraph
 */

require("range.js");

function jumpParagraphDown()
{
  const cursor = view.cursorPosition();
  let line = cursor.line;
  let nextLine = line;

  for (;;)
  {
    line = document.nextNonEmptyLine(nextLine);
    if (nextLine !== line)
      break;
    ++nextLine;
  }

  if (line === -1)
    line = document.lines() - 1;
  view.setCursorPosition(line, cursor.column);
}

function jumpParagraphUp()
{
  const cursor = view.cursorPosition();
  let line = cursor.line;
  let nextLine = line;

  for (;;)
  {
    line = document.prevNonEmptyLine(nextLine);
    if (nextLine !== line)
      break;
    --nextLine;
  }

  if (line === -1)
    line = 0;
  view.setCursorPosition(line, cursor.column);
}


function help(cmd)
{
  if (cmd === 'jumpParagraphUp')
    return i18n("Move cursor to previous paragraph");
  if (cmd === 'jumpParagraphDown')
    return i18n("Move cursor to next paragraph");
}
