require('range.js')

// fn: (String): String|undefined
// When fn returns undefined, do nothing
function selectionOrLineProcess(restoreCursor, restoreSelection, fn)
{
  const hasSelection = view.hasSelection();
  const cursor = view.cursorPosition();
  const line = cursor.line;
  let selection;
  let text;

  if (hasSelection)
  {
    selection = view.selection();
    text = view.selectedText();
  }
  else
  {
    text = document.line(line);
  }

  text = fn(text);

  if (text === undefined)
    return;

  document.editBegin();

  if (hasSelection)
  {
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
  }
  else
  {
    document.removeLine(line);
    // insertText instead of insertLine to prevent adding a newline if text contains a newline
    document.insertText({line: line, column: 0}, text);

    if (restoreCursor)
    {
      view.setCursorPosition(cursor);
    }
  }

  document.editEnd();
}
