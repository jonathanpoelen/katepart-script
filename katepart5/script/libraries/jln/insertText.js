require('cursor.js')

function insertText(text)
{
  document.editBegin();
  document.insertText(view.cursorPosition(), text);
  document.editEnd();
}
