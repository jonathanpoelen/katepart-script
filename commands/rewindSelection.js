/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 10
 * kate-version: 4
 * type: commands
 * functions: rewindSelection
 */


function rewindSelection()
{
  var selection = view.selection();
  if (selection.isValid())
  {
    var cursor = view.cursorPosition();
    view.clearSelection();
    setCursorToEdgeTheSelection(selection, cursor, true);
  }
}


function action(cmd)
{
  if ("rewindSelection" === cmd)
    return {
      category: "Selection",
      interactive: false,
      text: i18n("Reset selection"),
      shortcut: "Ctrl+Alt+J"
    };
}


function help(cmd)
{
  if (cmd === "rewindSelection")
    return i18n("Met le curseur au début de la sélection et annule celle-ci.\
<br/><br/>rewindSelection()");
}
