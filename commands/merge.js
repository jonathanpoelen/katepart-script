/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: merge, mergeText, mergeTextMultiLine
 */

require("string-utils.js")
require("array-utils.js")
require("selectionOrLine.js")
require("removeThenInsertText.js")
require("range.js")


function merge(pattern, l1, l2, h)
{
  var selection;
  var r = "";
  if (view.hasSelection())
  {
    selection = view.selection();
    l1 = selection.start.line;
    h = selection.end.line - l1;
    if (selection.end.column && !(h&1))
    {
      h /= 2;
      r = '\n'+document.line(l1+h);
      l2 = l1 + h + 1;
    }
    else
    {
      h /= 2;
      ++h;
      l2 = l1 + h;
    }
  }
  else
  {
    if (pattern && !isNaN(pattern))
    {
      h = l2;
      l2 = l1;
      l1 = pattern;
      pattern = undefined;
    }
    l2 = +l2;
    l1 = +l1;
    if (isNaN(h = +h))
    {
      h = l2;
      l2 = l1 + h + 1;
    }
    if (isNaN(h))
    {
      h = l1;
      l1 = view.cursorPosition();
      l2 = l1 + h + 1;
    }
  }

  h = ~~h;
  var s1 = getSelectionCountLines(l2, h);
  var s2 = getSelectionCountLines(l1, h);
  if (s1.overlaps(s2))
    return ;

  var a = document.text(s1).split("\n");
  var str = document.text(s2);

  document.editBegin();
  if (selection)
    view.removeSelectedText();
  else
  {
    ++s1.end.line;
    s1.end.column = 0;
    if (s1.start.compareTo(s2.start) < 0)
    {
      var tmp = s1;
      s1 = s2;
      s2 = tmp;
      l1 -= 2;
    }
    document.removeText(s1);
    document.removeText(s2);
  }
  document.insertText(l1, 0, str.eachLine(
    (!pattern || (pattern = interpretStr(pattern)) === "$1$2")
    ? function(l, k){
      return l + a[k];
    } : function(l, k){
      return pattern.replace("$1", l).replace("$2", a[k]);
  }) + r);
  document.editEnd();
}


function mergeText(/*pattern, …*/)
{
  var pattern = $M(arguments, interpretStr).join(" ");
  if (!pattern)
    return;
  var selection = selectionOrLine(null);
  removeRangeThenInsertText(selection.range, selection.text.eachLine(function(l){
    return pattern.replace("$1", l);
  }));
}


function mergeTextMultiLine(n/*, pattern, …*/)
{
  var pattern = $A(arguments, 1).map(interpretStr).join(" ");
  if ((n = +n) < 2)
    return mergeText(pattern);
  if (!pattern)
    return;
  var selection = selectionOrLine(null);
  var lines = selection.text.split("\n");
  var str = "", i = 0, len = lines.length;
  while (i < len){
    str += pattern.replace("$1", lines.slice(i, i += n).join("\n"));
    if (i < len)
      str += "\n";
  }
  removeRangeThenInsertText(selection.range, str);
}

function help(cmd)
{
  if (cmd === "merge")
    return i18n("Assemble 2 blocs de text.\
<br/><br/>merge(pattern: String= $1$2, line1: Number= pattern, line2: Number= line1, height: Number= line2|line1)\
<br/>pattern: $1 correspond au premier bloc de texte et $2 au second.\
<br/>line1: Si une sélection existe ce paramètre est ignoré.\
<br/>line2: Si une sélection existe ce paramètre est ignoré.\
<br/>height: Si une sélection existe ce paramètre est ignoré.");

  if (cmd === "mergeText")
    return i18n("Modifie la ligne ou les lignes de la selection selon un pattern.\
<br/><br/>mergeText(pattern: String, …)\
<br/>pattern: $1 correspond à la ligne.");

  if (cmd === "mergeTextMultiLine")
    return i18n("Modifie la ligne ou n lignes de la selection selon un pattern.\
<br/><br/>mergeTextMultiLine(\
numberLine: Number, pattern: String, …\
)");
}
