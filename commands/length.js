/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: length
 */

require("insertion.js")
require("interpretStr.js")
require("range.js")


function length()
{
  var len = arguments.length - 1;
  for (var i = 0; i < arguments.length; ++i)
    len += interpretStr(arguments[i]).length;
  insertText(len);
}


function help(cmd)
{
  if (cmd === "length")
    return i18n("Compte le nombre de caractères passés en paramètres et l'écrit à la position du curseur. Ajoute nombre_paramètre - 1 à la taille.\
<br/><br/>length(…: String)\
<br/><br/>exemple:\
<br/>$ length un exemple simple\
<br/>17");
}
