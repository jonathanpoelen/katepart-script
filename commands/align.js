/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: align
 */

require("string-utils.js")
require("cursor-utils.js")
require("interpretStr.js")
require("removeThenInsertText.js")
require("stringOrRegex.js")
require("toBoolean.js")
require("range.js")


function align(split, delimiter, complet, completeLast, keepSplit)
{
  var textSplit = split;
  split = split ? stringOrRegex(split) : (/[ \t]/);
  delimiter = undefined === delimiter ? " " : interpretStr(delimiter);
  complet = undefined !== complet && interpretStr(complet) || " ";
  completeLast = undefined === completeLast || toBoolean(completeLast);

  var selection = getSelectionBlock();
  var linesCol = document.text(selection).split("\n").map(toBoolean(keepSplit) ?
    function(v){
      return v.split(split).map(function(v){
        return v+textSplit;
      }).filter(Boolean);
    } : function(v){
      return v.split(split).filter(Boolean);
    }
  );
  var maxCol = linesCol.reduce(function(max, v){
    return Math.max(max, v.length);
  }, 0);

  var maxSpaces = [];
  for (var col = 0; col < maxCol; ++col)
  {
    maxSpaces.push(linesCol.reduce(function(max, v){
      return v[col] ? Math.max(max, v[col].length) : max;
    }, 0));
  }

  removeRangeThenInsertText(selection, linesCol.map(function(v){
    return v ? v.map(function(v, k, array){
      return v.length !== maxSpaces[k] ?
        v + ((!completeLast && k === array.length - 1) ? ''
        : complet.repeat(Math.max(1, (maxSpaces[k] - v.length) / complet.length))
            .substr(0, maxSpaces[k] - v.length)
        ) : v;
    }).join(delimiter) : "";
  }).join("\n"));
}

function help(cmd)
{
  if (cmd === "align")
    return i18n("Aligne les lignes du document ou du paragraphe de la sélection.\
<br/><br/>align(split: String|RegExp= [ \\t], delimiter: String= ' ', complet: String= ' ', completLast: Boolean= false, keepSplit: Boolean= false)\
<br/>split: regex pour séparer les colonnes.\
<br/>delimiter: chaîne pour délimiter les colonnes.\
<br/>complet: chaîne qui remplace les espaces vides.\
<br/>completLast: Indique si la dernière colonne doit être complétée par complet.\
<br/>keepSplit: Indique si le texte retirer par le split doit être garder. Toutefois c'est le texte du split qui est mis et non le texte véritablement enlever.\
<br/><br/>exemple:\
<br/>150 4051 54\
<br/>15 6 8\
<br/>$ align ' ' |\
<br/>150|4051|54\
<br/>15 |6   |8 ");
}
