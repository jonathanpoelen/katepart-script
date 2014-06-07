/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: echap
 */

require("removeThenInsertText.js")
require("selectionOrLine.js")
require("toBoolean.js")
require("string-utils.js")
require("range.js")

function echap(str, strEscape, force)
{
  strEscape = strEscape || "\\";
  var selection = selectionOrLine(),
    text = document.text(selection),
    index;

  if (!str)
  {
    if (!(str = text[text.firstIndexNonSpace()]))
      return;
    index = text.allIndexOf(str).slice(1, -1);
  }
  else
    index = text.allIndexOf(str);

  if (!toBoolean(force))
    index = index.filter(function(v){
      var n = 1;
      while (strEscape === text.substr(v - strEscape.length * n, strEscape.length))
        ++n;
      return n === 1 || n&1;
    });

  removeRangeThenInsertText(selection, index.reduce(function(accu, v, k){
    return accu + text.substring(index[k - 1], v) + strEscape;
  }, "") + text.substring(index.pop()));
}

function help(cmd)
{
  if (cmd === "echap")
    return i18n("Échappe la sélection ou la ligne.\
<br/><br/>echap(str: undefined|String= text[text.search(/[^\\s]/)], strEscape: String= '\\', force: Boolean= false)\
<br/>str: Chaîne à protéger. Par défaut, premier caractère de sélection ou de la ligne qui n'est pas un caractère blanc.\
<br/>strEscape: Chaîne d'échappement.\
<br/>force: Si vrai les chaînes déjà protégées seront considérées comme non protégées.\
<br/><br/>exemple:\
<br/>\"une chaîne \"non\" protégée !\"\
<br/>$ echap\
<br/>\"une chaîne \\\"non\\\" protégée !\"");
}
