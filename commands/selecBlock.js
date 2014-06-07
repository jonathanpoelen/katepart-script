/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: selectBlock, selectForCut
 */

require("cursor-utils.js")
require("toBoolean.js")
require("range.js")


function selectBlock(nonWhitespace)
{
  view.setSelection(getSelectionBlock(null, toBoolean(nonWhitespace)));
}


function selectForCut()
{
  view.setSelection(getSelectionForCut());
}


function action(cmd)
{
  if ("selectForCut" === cmd)
    return {
      icon: "",
      category: "",
      interactive: false,
      text: i18n("Selection for cut"),
      shortcut: "Ctrl+Alt+E"
    };
}


function help(cmd)
{
  if (cmd === "selectBlock")
    return i18n("Sélection du début de la ligne de sélection à la fin de la ligne de la sélection. Si aucune sélection, sélectionne tout le document. Voir getSelectionBlock.\
<br/><br/>selectBlock(nonWhitespace: Boolean)");

  if (cmd === "selectForCut")
    return i18n("Change la sélection pour pouvoir couper un block de texte sans laisser de saut de ligne. Voir getSelectionForCut.\
<br/><br/>selectForCut()");
}
