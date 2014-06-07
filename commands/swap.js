/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: swap, set-default-delimiter-swap, smartSwap, set-pattern-smart-swap, swapCharacter, preventSwapCharacter
 */

require("removeThenInsertText.js")
require("selectionOrLine.js")
require("interpretStr.js")
require("position.js")
require("edit.js")
require("range.js")


var defaultDelimiterSwap = ',';
this["set-default-delimiter-swap"] = function(str){
  defaultDelimiterSwap = str || "";
};

function swap(delimiter, ignoreBackslash, pos)
{
  var selection = selectionOrLine(),
    text = document.text(selection),
    s1 = "", s2 = "";
  if (delimiter || defaultDelimiterSwap)
  {
    delimiter = interpretStr(delimiter || defaultDelimiterSwap);
    var frag = text.split(delimiter);
    if (1 < frag.length)
    {
      pos = +pos || 1;
      if (pos < 0)
      {
        if (pos < -frag.length)
          return;
        pos += frag.length;
      }
      s1 = frag.slice(0, pos).join(delimiter);
      s2 = frag.slice(pos).join(delimiter);
    }
  }
  else
  {
    delimiter = "";
    s1 = text.substr(0, view.cursorPosition().column);
    s2 = text.substr(s1.length);
  }

  if (s1.length && s2.length)
  {
    var append = "", prepend = "";
    ignoreBackslash = ignoreBackslash ? Math.abs(ignoreBackslash) : 2
    if (1 === ignoreBackslash || 2 === ignoreBackslash)
    {
      prepend = s1.firstSpace();
      append = s2.lastSpace();

      if (1 === ignoreBackslash)
      {
        s1 = s1.trimLeft();
        s2 = s2.trimRight();
      }
      else
      {
        delimiter = s1.lastSpace() + delimiter + s2.firstSpace();
        s1 = s1.trim();
        s2 = s2.trim();
      }
    }
    removeRangeThenInsertText(selection, prepend + s2 + delimiter + s1 + append);
  }
}

var defaultPatternSwap = /([a-zA-Z_]*)/;
var defaultIsPatternSwap = /[a-zA-Z_]/;
this["set-pattern-smart-swap"] = function(pattern){
  if (pattern)
  {
    defaultPatternSwap = new RegExp("(["+pattern+"]*)");
    defaultIsPatternSwap = new RegExp("["+pattern+"]");
  }
  else
  {
    defaultPatternSwap = /([a-zA-Z_]*)/;
    defaultIsPatternSwap = /[a-zA-Z_]/;
  }
};

function smartSwap(pattern)
{
  var cursor = view.cursorPosition();
  var is = pattern ? new RegExp("["+pattern+"]") : defaultIsPatternSwap;
  var pattern = pattern ? new RegExp("(["+pattern+"]*)") : defaultPatternSwap;
  var strs = document.line(cursor.line).split(pattern);
  if (!strs.length)
    return ;

  var i, len = 0;
  for (i in strs){
    if ((len += strs[i].length) >= cursor.column)
      break;
  }

  i = +i;
  var iswap = i + 1;
  while (iswap !== strs.length && -1 === strs[iswap].search(is))
    ++iswap;
  if (iswap === strs.length)
  {
    while (i !== -1 && -1 === strs[i].search(is))
      --i;
    if (i === -1)
      return ;
    iswap = i--;
  }
  while (i !== -1 && -1 === strs[i].search(is))
    --i;
  if (i === -1)
    return ;

  var tmp = strs[i];
  strs[i] = strs[iswap];
  strs[iswap] = tmp;
  edit(function(){
    document.removeLine(cursor.line);
    document.insertLine(cursor.line, strs.join(""));
    cursor.column = 0;
    while (-1 !== iswap)
      cursor.column += strs[iswap--].length;
    view.setCursorPosition(cursor);
  });
}


function _swapCharacter(cursor)
{
  var range;

  if (cursor.column === 0)
  {
    if (cursor.line !== 0)
      range = new Range(cursor.line - 1, document.lineLength(cursor.line - 1) , cursor.line, 1);
    else if (document.lineLength(cursor.line) >= 2)
      range = new Range(cursor.line, cursor.column, cursor.line, cursor.column + 2);
    else
      return;
  }
  else if (cursor.column === document.lineLength(cursor.line))
    range = new Range(cursor.line, cursor.column - 2, cursor.line, cursor.column);
  else
    range = new Range(cursor.line, cursor.column - 1, cursor.line, cursor.column + 1);

  var str = document.text(range);
  removeRangeThenInsertText(range, str[1] + str[0]);
}

function swapCharacter()
{
  _swapCharacter(view.cursorPosition());
}


function preventSwapCharacter()
{
  var cursor = view.cursorPosition();
  _swapCharacter(cursor.line < 1 && cursor.column < 2 ? cursor : Position.recoil(cursor));
}


function action(cmd)
{
  if ("swapCharacter" === cmd)
    return {
      icon: "",
      category: "",
      interactive: false,
      text: i18n("Advanced Transpose Characters"),
      shortcut: "Ctrl+Alt+T"
    };
  if ("preventSwapCharacter" === cmd)
    return {
      icon: "",
      category: "",
      interactive: false,
      text: i18n("Advanced Transpose Prevent Characters"),
      shortcut: "Ctrl+Shift+Alt+T"
    };
}

function help(cmd)
{
  if (cmd === "preventSwapCharacter")
    return i18n("Le curseur est déplacé vers la gauche puis swapCharacter est utilisé.\
<br/><br/>preventSwapCharacter()");

  if (cmd === "set-default-delimiter-swap")
    return i18n("Délimiteur par défaut de swap si aucun n'est passé en paramètre.\
<br/><br/>set-default-delimiter-swap(delimiter: String= '')");

  if (cmd === "set-pattern-smart-swap")
    return i18n("Pattern par défaut de smartSwap si aucun n'est passé en paramètre.\
<br/><br/>set-pattern-smart-swap(pattern: String= '')");

  if (cmd === "swap")
    return i18n("Intervertit les 2 fragments de chaînes recupérés dans le texte sélectionné ou dans la ligne.\
<br/><br/>swap(delimiter: String= '', ignoreBackslash: 0|1|2= 1, position: Number= 1)\
<br/>delimiter: Définit la césure de la chaîne. Si la chaîne est vide la césure se fait au niveau du curseur.\
<br/>ignoreBackslash: Si 1, les espaces au bord de la chaîne sont ignorés. Si 2 les espaces au bord des fragments de chaînes sont ignorés.\
<br/>position: Si la chaîne n'est pas vide, correspond à la position du délimiteur.\
<br/><br/>exemple:\
<br/>a = b\
<br/>$ swap ' = '\
<br/>b = a\
<br/><br/>exemple:\
<br/>a = b = c\
<br/>$ swap = 2\
<br/>b = c = a\
<br/><br/>exemple:\
<br/>a = b = c\
<br/>$ swap = 2 -1\
<br/>c = a = b");

  if (cmd === "swapCharacter")
    return i18n("Ceci est une amélioration de la transposition de caractères présent par défaut. Si le curseur ce trouve en fin de ligne il intervertit les 2 derniers caractères de cette ligne. S'il ce trouve au début d'une ligne, la première lettre monte à la fin de la précédente. Et enfin, si le curseur est au début du document les 2 premiers caractère sont intervertits.\
<br/><br/>swapCharacter()");

  if (cmd === "smartSwap")
    return i18n("Intervertit 2 fragments de chaînes recupérés via un pattern.\
<br/><br/>smartSwap(pattern: String= '')");
}
