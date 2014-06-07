require("range.js")

function rangeLength(start, end)
{
  if (!end)
  {
    end = start.end;
    start = start.start;
  }
  if (start.compareTo(end) === 1)
  {
    var tmp = start;
    start = end;
    end = tmp;
  }
  if (end.line === start.line)
    return end.column - start.column;
  var ret = -start.column;
  for (var line = start.line; line < end.line; ++line)
    ret += document.lineLength(line);
  return ret + end.column;
}


function setCursorToEdgeTheSelection(selection, cursor, reverseCondition)
{
  view.setCursorPosition(cursor.equals(selection.start) != reverseCondition ? reverseCondition ? selection.start : cursor : selection.end);
}


function setSelection(selection, cursor)
{
  cursor = cursor || view.cursorPosition();
  view.setSelection(selection);
  setCursorToEdgeTheSelection(selection, cursor);
}


function getSelectionLines(beginLine, endLine)
{
  return new Range(beginLine, 0, endLine, document.lineLength(endLine));
}

function getSelectionLine(line)
{
  return getSelectionLines(line, line);
}

function getSelectionCountLines(beginLine, count)
{
  return getSelectionLines(beginLine, beginLine + count - 1);
}

function getSelectionAll()
{
  return getSelectionLines(0, document.lines() - 1);
}


function getSelectionBlock(selection, nonWhitespace){
  selection = selection || view.selection();
  if (selection.isValid())
  {
    selection.start.column = 0;
    selection.end.column = document.lineLength(selection.end.line);
  }
  else
  {
    // use whole range
    selection = getSelectionAll();
  }
  return nonWhitespace ? getSelectionWithoutWhitespace(selection) : selection;
}


function getSelectionWithoutWhitespace(selection){
  selection = selection || view.selection();
  var first = document.firstColumn(selection.start.line),
    last = document.lastColumn(selection.end.line);
  if (-1 !== first)
    selection.start.column = first;
  if (-1 !== last)
    selection.end.column = last;
  return selection;
}


function getCursorEndText(text, cursor)
{
  cursor = cursor || view.cursorPosition();
  text = text.split("\n");
  var end = text.length - 1;
  return new Cursor(cursor.line + end, cursor.column + text[end].length);
}


function getSelectionForCut(selection)
{
  if (!selection)
    selection = view.hasSelection() ? getSelectionBlock() : getSelectionLine(view.cursorPosition().line);

  if (selection.start.line === 0)
  {
    ++selection.end.line;
    selection.end.column = 0;
  }
  else
    selection.start.column = document.lineLength(--selection.start.line);
  return selection;
}
