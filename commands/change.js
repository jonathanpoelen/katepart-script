/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: change, changex
 */

require("insertion.js")
require("array-utils.js")
require("stringOrRegex.js")

function _change(split, replaces)
{
  insertText(
    replaces.length === 1 ?
      split.join(replaces) :
      split.slice(0, -1).map(function(str, k){
        return str + replaces[k % replaces.length];
      }).join("") + split.pop()
  );
}


function change(/*str, rgx, remplace1, …*/)
{
  editText(arguments, function(str, rgx){
    _change(str.split(stringOrRegex(rgx)), $A(arguments, 2).map(interpretStr));
  }, true);
}


function changex(/*str, n, rgx, …, rgxn, remplace1, …*/)
{
  editText(arguments, function(str, n, rgx){
    if (!(n = Math.abs(n)))
      return ;
    var split = str.split(stringOrRegex(rgx));
    for (var i = 1; i < n; ++i)
    {
      var a = [];
      for (k in split)
        a.push.apply(a, split[k].split(stringOrRegex(arguments[i+2])));
      split = a;
    }
    _change(split, $A(arguments, 2 + n).map(interpretStr));
  }, true);
}

function help(cmd)
{
  if (cmd === "change")
    return i18n("Remplace la sélection ou le 1er paramètre –via une regex représentée par le paramètre suivant– autant de fois qu'il reste de paramètres.\
<br/><br/>change(str: String, rgx: String|RegExp, remplace: String, …)\
<br/><br/>exemple:\
<br/>$ change \"a[i] = i; b[i] = i; c[i] = i;\" i 0 1\
<br/>a[0] = 1; b[0] = 1; c[0] = 1;");

  if (cmd === "changex")
    return i18n("Remplace la sélection ou le 1er paramètre –via une regex représentée par les n paramètre suivant– autant de fois qu'il reste de paramètres.\
<br/><br/>changex(str: String, n: Number, rgx: String|RegExp, …, remplace: String, …)\
<br/><br/>exemple:\
<br/>$ changex \"a[i] = i; b[i] = i; c[i] = i;\" 3 a b i e f\
<br/>e[f] = e; f[e] = f; c[e] = f;");
}
