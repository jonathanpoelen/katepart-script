const katescript = {
  "author": "Jonathan Poelen <jonathan.poelen+katescript@gmail.com>",
  "license": "BSD",
  "revision": 2,
  "kate-version": "5.1",
  "functions": [ "duplicate" ],
  "actions": [
    { "function": "duplicate"
    , "name": "Duplicate selection or line"
    , "category": "Editing"
    , "shortcut": "Ctrl+Alt+D"
    }
  ]
};

require('range.js')

function duplicate(n)
{
  n = parseInt(n) || 1;
  const rep = Math.abs(n) || 1;

  document.editBegin();

  if (!view.hasSelection())
  {
    const cursor = view.cursorPosition();
    const text = document.line(cursor.line) + '\n';
    document.insertText(cursor.line, 0, text.repeat(rep));
    if (n < 0)
    {
      view.setCursorPosition(cursor);
    }
  }
  else
  {
    const selection = view.selection();
    const text = view.selectedText().repeat(rep);

    if (n < 0)
    {
      const cursor = view.cursorPosition();
      document.insertText(selection.end, text);
      if (cursor.equals(selection.end)) {
        view.setCursorPosition(selection.end);
      }
    }
    else
    {
      document.insertText(selection.start, text);
      if (selection.onSingleLine())
      {
        selection.start.column += text.length;
        selection.end.column += text.length;
      }
      else
      {
        const d = (selection.end.line - selection.start.line) * rep;
        selection.start.column = selection.end.column;
        selection.start.line += d;
        selection.end.line += d;
      }
      view.setSelection(selection);
    }
  }

  document.editEnd();
}

function help(cmd)
{
  if (cmd === "duplicate")
    return i18n("Duplicate selection or line N times.\
<br/><br/>duplicate(n: Number = 1)\
<br/>A negative number for <b>n</b> adds the text after the line or selection.");
}
