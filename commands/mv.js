/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: mv, mvLines, swapLine
 */

require("cursor-command.js")
require("edit.js")

var window = this;


function mv(newPos)
{
  if (!view.hasSelection() || !newPos)
    return mvLines(newPos);

  var text = view.selectedText();
  edit(function(){
    view.setCursorPosition(view.selection().start);
    view.removeSelectedText();
    cursor(newPos);
    document.insertText(view.cursorPosition(), text);
  });
}


function mvLines(newPos)
{
  var range = view.selection(),
    cursor = view.cursorPosition(),
    line;

  if (newPos) {
    var n = +newPos;
    if (!isNaN(n))
      line = (newPos[0] === '+' || newPos[0] === '-') ? cursor.line + n : n - 1;
    else {
      window.cursor(newPos);
      line = view.cursorPosition().line;
    }
  } else {
    line = cursor.line + 1;
  }

  if (line < 0 || line === cursor.line || line >= document.lines())
    return;

  if (range.isValid()) {
    var diff = range.end.line - cursor.line;
    var selection = range.clone();
    var text = document.text(getSelectionBlock(range));
    if (false === edit(function(){
      document.removeText(getSelectionForCut(range));
      var newLine = line - cursor.line + range.start.line + 1;
      if (newLine < 0)
        return false;
      document.insertText(new Cursor(newLine, 0), text+"\n");
    }))
      return;
    selection.start.line += line - cursor.line;
    selection.end.line += line - cursor.line;
    view.setSelection(selection);
    cursor.line = selection.end.line - diff;
  } else {
    var text = document.line(cursor.line);
    edit(function(){
      document.removeLine(cursor.line);
      document.insertLine(line, text);
    });
    cursor.line = line;
  }
  view.setCursorPosition(cursor);
}


function swapLine(l1, l2)
{
  var cursorPosition = view.cursorPosition();
  var c = l1;
  if (l2)
  {
    cursor(c);
    c = l2;
    l1 = view.cursorPosition().line;
  }
  else
    l1 = cursorPosition.line;
  cursor(c);
  l2 = view.cursorPosition().line;
  if (l2 < l1) {
    c = l1;
    l1 = l2;
    l2 = c;
    view.setCursorPosition(l2);
  }
  edit(function(){
    var text1 = document.line(l1);
    var text2 = document.line(l2);
    document.removeLine(l2);
    document.removeLine(l1);
    document.insertLine(l1, text2);
    document.insertLine(l2, text1);
    view.setCursorPosition(cursorPosition);
  });
}

function help(cmd)
{
  if (cmd === "mv")
    return i18n("Bouge le texte de la sélection ou la ligne.\
<br/><br/>mv(newPos: cursor|Number)\
<br/>newPos: S'il n'y a pas de sélection ou que newPos est vide ou est un nombre, alors mvLines est appelée.");

  if (cmd === "mvLines")
    return i18n("Bouge les lignes sélectionnées ou celle où ce trouve le curseur.\
<br/><br/>mvLines(newPos: cursor|Number)");

  if (cmd === "swapLine")
    return i18n("Intervertit 2 lignes.\
<br/><br/>swapLine(l1: cursor= view.cursorPosition().line, l2: cursor= l1)");
}
