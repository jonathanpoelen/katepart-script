/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: capitalize, reverseCase, dashedCase, underscoreCase, camelCase, toggleCaseUnderCursor
 */

require("selectionOrLine.js")
require("toBoolean.js")
require("removeThenInsertText.js")


function capitalize(rgx, isMinimal)
{
  var selection = selectionOrLine(false);
  removeRangeThenInsertText(selection.range, selection.text.replace(rgx ? RegExp(toBoolean(isMinimal) ? "(^["+rgx+"])|[^"+rgx+"](["+rgx+"])" : rgx, "g") : (/(^[\x7E-\xFFa-z])|[^\x7E-\xFFa-z\d]([\x7E-\xFFa-z])/gi), function(s){
    return s.toUpperCase();
  }));
}


var window = this;

forEach({dashed: '-', underscore: '_'}, function(c, name){
  window[name+"Case"] = function(){
    var selection = selectionOrLine(false);
    removeRangeThenInsertText(selection.range, selection.text
    .replace(/([A-Z])/g, function(all, letter) {
      return c + letter.toLowerCase();
    }));
  };
});


function camelCase(ignoreC)
{
  var selection = selectionOrLine(false);
  removeRangeThenInsertText(selection.range, selection.text
  .replace(RegExp((ignoreC === '-' ? '_' : ignoreC === '_' ? '-' : "[-|_]") + "([a-z]|[0-9])", "ig"), function(all, letter) {
    return letter.toUpperCase();
  }));
}


function reverseCase()
{
  var selection = selectionOrLine(false);
  var s = "", t = selection.text, len = t.length, c;
  for (var i = 0; i !== len; ++i){
    c = t[i].toUpperCase();
    s += c == t[i] ? t[i].toLowerCase() : c;
  }
  removeRangeThenInsertText(selection.range, s);
}


function toggleCaseUnderCursor()
{
  var cursor1 = view.cursorPosition();
  var c = document.charAt(cursor1);
  if (c) {
    var upper = c.toUpperCase();
    c = (c === upper) ? c.toLowerCase() : upper;
    var cursor2 = new Cursor(cursor1.line, cursor1.column + 1);
    removeRangeThenInsertText(new Range(cursor1, cursor2), c);
    view.setCursorPosition(cursor1);
  }
}

function help(cmd)
{
  if (cmd === "camelCase")
    return i18n("Transforme la ligne ou de la sélection en camelCase, les tirets ou underscore suivit d'un caractère alpanumérique sont remplacé par un ça majuscule.\
<br/><br/>camelCase(ignoreC: String= undefined)\
<br/>ignoreC: Prend comme valeur - ou _.");

  if (cmd === "capitalize")
    return i18n("Met les premières lettre de chaque mot de la ligne ou de la sélection en majuscule.\
<br/><br/>capitalize(rgx= /(^[\\x7E-\\xFFA-Za-z])|[^\\x7E-\\xFFA-Za-z\\d]([\\x7E-\\xFFA-Za-z])/g, isMinimal= false)\
<br/>rgx: RegExp pour capturer les lettres à mettre en majuscule.\
<br/>isMinimal: Si true alors rgx = \"(^[\\rgx+\"])|[^\\rgx+\"]([\\rgx+\"])\"");

  if (cmd === "dashedCase")
    return i18n("Met les lettre de la ligne ou de la sélection en minuscule précédé d'un tiret.\
<br/><br/>dashedCase()");

  if (cmd === "reverseCase")
    return i18n("Intervertit majuscule/minuscule.\
<br/><br/>reverseCase()");

  if (cmd === "underscoreCase")
    return i18n("Met les lettre de la ligne ou de la sélection en minuscule précédé d'un underscore.\
<br/><br/>underscoreCase()");

  if (cmd === "toggleCaseUnderCursor")
    return i18n("Toggles the case of character under cursor: lowercase becomes uppercase and vice versa.\
<br/><br/>toggleCaseUnderCursor()");
}
