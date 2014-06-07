require("range.js")

function removeThenInsert(fnRemove, fnInsert, param1Remove, param1Insert, str, noEdit)
{
  if (!noEdit)
    document.editBegin();
  //view.clearSelection();
  try
  {
    if (typeof fnRemove === "function")
      fnRemove(param1Remove);
    if (typeof fnInsert === "function")
      fnInsert(param1Insert, str);
  }
  finally
  {
    if (!noEdit)
      document.editEnd();
  }
}

function removeRangeThenInsertText(selection, text, noEdit)
{
  removeThenInsert(document.removeText, document.insertText, selection, selection.start, text, noEdit);
}

/*function removeLineThenInsertLine(line, text, noEdit)
{
  removeThenInsert(document.removeLine, document.insertLine, line, line, text, noEdit);
}*/
