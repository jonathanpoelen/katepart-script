require('range.js')

// fn: (String): String|undefined
// When fn returns undefined, do nothing
function selectionProcess(restoreSelection, fn)
{
  const text = fn(view.selectedText());

  if (text === undefined)
    return;

  const selection = view.selection();
  const cursor = view.cursorPosition();
  const line = cursor.line;

  document.editBegin();

  const start = selection.start;
  document.removeText(selection);
  document.insertText(start, text);

  if (restoreSelection)
  {
    view.setSelection({start: start, end: view.cursorPosition()});
    if (cursor.equals(start))
    {
      view.setCursorPosition(cursor);
    }
  }

  document.editEnd();
}

// fn: (String, Cursor): String|undefined
// When fn returns undefined, do nothing
function lineProcess(restoreCursor, fn)
{
  const cursor = view.cursorPosition();
  const line = cursor.line;
  const text = fn(document.line(line), cursor);

  if (text === undefined)
    return;

  document.editBegin();

  document.removeLine(line);
  document.insertLine(line, text);

  if (restoreCursor)
  {
    view.setCursorPosition(cursor);
  }

  document.editEnd();
}

// fn: (String): String|undefined
// When fn returns undefined, do nothing
function selectionOrLineProcess(restoreCursor, restoreSelection, fn)
{
  if (view.hasSelection())
  {
    selectionProcess(restoreSelection, fn);
  }
  else
  {
    lineProcess(restoreCursor, fn);
  }
}
