const katescript = {
  "author": "Jonathan Poelen <jonathan.poelen+katescript@gmail.com>",
  "license": "BSD",
  "revision": 2,
  "kate-version": "5.1",
  "functions": [ "contextNext", "contextPrev" ]
};

/**
 * Move cursor to next/previous highlight context
 */

require("range.js");

function contextNext()
{
  const cursor = view.cursorPosition();
  const attr = document.attribute(cursor);

  const lines = document.lines();
  let len = document.lineLength(cursor.line);

  for (;;)
  {
    if (++cursor.column >= len)
    {
      if (++cursor.line === lines)
        return;
      cursor.column = 0;
      len = document.lineLength(cursor.line);
    }

    if (!document.isAttribute(cursor, attr))
    {
      view.setCursorPosition(cursor);
      return;
    }
  }
}

function contextPrev()
{
  const cursor = view.cursorPosition();

  while (!cursor.column) {
    if (--cursor.line === -1)
      return;
    cursor.column = document.lineLength(cursor.line);
  }
  --cursor.column;

  const attr = document.attribute(cursor);

  for (;;)
  {
    while (!cursor.column)
    {
      if (--cursor.line === -1)
        return;
      cursor.column = document.lineLength(cursor.line);
    }

    --cursor.column;
    if (!document.isAttribute(cursor, attr))
    {
      ++cursor.column;
      view.setCursorPosition(cursor);
      return;
    }
  }
}


function help(cmd)
{
  if (cmd === 'contextNext')
    return i18n("Move cursor to next highlighting context");

  if (cmd === 'contextNext')
    return i18n("Move cursor to previous highlighting context");
}
