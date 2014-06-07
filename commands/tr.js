/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: tr
 */

require("removeThenInsertText.js")
require("selectionOrLine.js")
require("interpretStr.js")
require("toBoolean.js")
require("array-utils.js")

function tr(findTo, replaceTo, empty)
{
  if (!findTo)
    return;

  findTo = interpretStr(findTo);
  replaceTo = interpretStr(replaceTo);
  var selection = selectionOrLine();
  var cLast = toBoolean(empty) ? "" : replaceTo[replaceTo.length - 1];
  var pos;

  removeRangeThenInsertText(
    selection,
    Array.reduce.call(document.text(selection), function(text, c){
      return text + (-1 !== (pos = findTo.indexOf(c)) ?
        replaceTo[pos] || cLast :
        c
      );
    }, "")
  );
}

function help(cmd)
{
  if (cmd === "tr")
    return i18n("Remplace ou supprime des caractères de la ligne ou de la sélection.\
<br/><br/>tr(findTo: String, replaceTo: String= '', empty: Boolean= false)\
<br/>empty: Si vrai les caractères de findTo n'ayant pas de correspondance dans replaceTo seront effacés. Si faux, il seront remplacés par le dernier caractère de replaceTo.\
<br/><br/>exemple:\
<br/>20521426563644556673853594\
<br/>$ tr 0123456789 abcdefghij\
<br/>cafcbecgfgdgeeffgghdifdfje\
<br/><br/>exemple:\
<br/>a b c d\
<br/>$ tr ' ' \\\\t\
<br/>a b c d");
}
