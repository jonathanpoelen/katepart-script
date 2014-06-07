/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: explode, cut, organizerLine
 */

require("string-utils.js")
require("array-utils.js")
require("cursor-utils.js")
require("selectionOrLine.js")
require("stringOrRegex.js")


function organizerLine(/*col, …*/)
{
  if (!arguments.length)
    return ;
  var selection = getSelectionBlock();
  var text = document.text(selection).split("\n");
  var pre = function(str){
    return str.slice(0,-1);
  }
  for (var i in text)
    text[i] += "\n";
  if (arguments[0].isYes())
    organizerText($A(arguments, 1), selection, text, Array.uniq, pre);
  else
    organizerText($A(arguments), selection, text, null, pre);
}


function processCol(args, filter)
{
  var selection = selectionOrLine();
  organizerText($A(args, 1), selection, document.text(selection).split(regexOrString(args[0])).filter(Boolean), filter);
}


function cut(/*rgx, cols, …*/)
{
  processCol(arguments, Array.uniq);
}


function explode(/*rgx, cols, …*/)
{
  processCol(arguments);
}


function organizerText(colsArrayString, selection, array, filter, pre)
{
  removeRangeThenInsertText(
    selection,
    (pre||Object)((filter||Object)(Array.linear(colsArrayString.map(function(cols){
      return parseColumns(cols, array.length);
    }))).reduce(function(accu, col){
      return accu + (array[col] || "");
    }, ""))
  );
}


/*
 * v = "n" : n
 * v = "n1-n2" : [n1, …, n2]
 * v = "n-" : [n, …, length]
 * v = "-n" : [0, n]
 * v = "-" : [0, …, length]
 */
function parseColumns(v, max)
{
  return v.split(",").map(function(cols){
    if (-1 === cols.indexOf("-"))
      return +cols || 0;
    cols = cols.split("-");
    cols[0] = Math.abs(~~cols[0]);
    if (cols[1])
    {
      cols[1] = Math.abs(cols[1]);
      if (!cols[1] || cols[1] > max)
        cols[1] = max;
    }
    else
      cols[1] = max;
    var a = [];
    while (cols[0] < cols[1])
      a.push(cols[0]++);
    return a;
  });
}


function help(cmd)
{
  if (cmd === "cut")
    return i18n("Idem que explode mais les colonnes déjà utilisées sont ignorées.\
<br/><br/>cut(rgx: String|RegExp, cols: String|Number, …)\
<br/><br/>exemple:\
<br/>je suis une phrase \
<br/>$ cut '( )' 4- 0-4 1 2\
<br/>une phrase je suis ");

  if (cmd === "explode")
    return i18n("Coupe le texte sélectionné ou la ligne en fragments et les affiche dans un ordre donné.\
<br/><br/>explode(rgx: String|RegExp, cols: String|Number, …)\
<br/>rgx: Le texte de la sélection ou de la ligne sera coupé avec la regex.\
<br/>cols: Voir parseColumns\
<br/><br/>exemple:\
<br/>je suis une phrase \
<br/>$ explode '( )' 4- 0-4\
<br/>une phrase je suis ");

  if (cmd === "organizerLine")
    return i18n("Ordonne les lignes dans l'ordre spécifiée.\
<br/><br/>organizerLine(uniq: String= undefined, cols: String|Number, …)\
<br/>uniq: Si uniq ce trouve dans String.yesWords alors les lignes double seront supprimer.\
<br/>cols: Chaque colonne est séparée par une virgule. Si la colonne est de la forme \"-n\" alors les colonnes de 0 à n sont récupérées. Si c'est de la forme \"n-\" alors les colonnes de n à la dernière sont récupérées. Si c'est \"-\" alors toutes les colonnes sont recupérées.");
}
