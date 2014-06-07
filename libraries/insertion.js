require("range.js")
require("cursor-utils.js")

function insertText(text)
{
  document.insertText(view.cursorPosition(), text);
}

function insertTextAndSelects(text, cursor)
{
  cursor = cursor || view.cursorPosition();
  document.insertText(cursor, text);
  view.setSelection(new Range(cursor, getCursorEndText(text, cursor)));
}
