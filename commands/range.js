/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: range
 */

require("interpretStr.js")
require("toBoolean.js")
require("insertion.js")


function range(begin, end, delimiter, step, selected)
{
  if (end === "" || isNaN(+end))
  {
    selected = step;
    step = delimiter;
    delimiter = end;
    end = begin;
    begin = 0;
  }
  begin = +begin || 0;
  end = +end || 9;
  delimiter = interpretStr(delimiter) || " ";
  step = +step || 1;
  var text = ""+begin;
  while (begin < end)
    text += delimiter + (begin += step);
  (toBoolean(selected) ? insertTextAndSelects : insertText)(text);
}


function help(cmd)
{
  if (cmd === "range")
    return i18n("Affiche un intervalle de nombre à la position du curseur.\
<br/><br/>range(begin: Number= 0, end: Number= begin|9, delimiter: String= ' ', step: Number= 1, selected: Boolean= false)\
<br/>end: Si ce n'est pas un type Number alors tous les paramètres sont décalés (end = begin, …) et begin = 0.");
}
