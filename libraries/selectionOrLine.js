require("cursor-utils.js")
require("range.js")

/*
Retourne un objet Range de la sélection ou représentant la ligne. Si lf est donné alors un objet {range:Range, text:String}. Si lf = true et qu'il n'y a pas de selection, alors \n est ajouté au texte.
*/
function selectionOrLine(lf, removeText)
{
  var selection = view.selection(), retObj = lf !== undefined, text;
  if (selection.isValid())
  {
    if (retObj)
      text = view.selectedText();
    if (removeText)
      view.removeSelectedText();
  }
  else
  {
    var line = view.cursorPosition().line;
    if (retObj) {
      text = document.line(line);
      if (lf) {
        text += "\n";
      }
    }
    selection = getSelectionLine(line);
    if (removeText)
      document.removeLine(line);
  }

  return retObj ? {range: selection, text: text} : selection;
}
