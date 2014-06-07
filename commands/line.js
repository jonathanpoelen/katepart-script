/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: line
 */

require("getCommandOrThrowError.js")
require("range.js")


function line(command/*, args…*/)
{
  command = getCommandOrThrowError(command);
  var text = view.hasSelection() ? view.selectedText() : null;
  var line = view.cursorPosition().line;
  view.setSelection(new Range(line, 0, line+1, 0));
  var args = $A(arguments, 1);
  command.apply(null, text ? [text].concat(args) : args);
}


function help(cmd)
{
  if (cmd === "line")
    return i18n("Sélectionne la ligne à la position du curseur puis appel command en donnant en premier paramètre et si elle existe, la sélection de l'utilsateur.\
<br/><br/>line(command: String, [params: mixed, …])");
}
