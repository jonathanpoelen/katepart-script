/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: repeat, replace, repeatx, replacex
 */

require("stringOrRegex.js")
require("interpretStr.js")
require("array-utils.js")
require("insertion.js")
require("edit.js")

var window = this;

["replace", "repeat"].forEach(function(name, k){
  window[name] = function(/*str, rgx, remplace1, …*/){
    editText(arguments, function(str, rgx){
      rgx = stringOrRegex(rgx, "g");
      insertText((k ? str : "") + $A(arguments, 2).reduce(function(accu, v){
        return accu + str.replace(rgx, interpretStr(v));
      }, ""));
    }, true);
  };
  window[name+"x"] = function(/*str, n, rgx, …, rgxn, remplace1, …*/){
    editText(arguments, function(str, n){
      if (!(n = Math.abs(n)))
        return ;
      var len = Math.floor((arguments.length - 2) / n) - 1, i = 0;
      var a = new Array(len);
      while (i < len)
        a[i++] = str;
      for (i = 0; i < n; ++i)
        arguments[i+2] = stringOrRegex(arguments[i+2], "g");
      for (var ii = 0, kk; ii < len; ++ii)
      {
        for (i = 2, kk = ii*n+n; i < n+2; ++i)
          a[ii] = a[ii].replace(arguments[i], interpretStr(arguments[kk+i]));
      }
      insertText((k ? str : "") + a.join(""));
    }, true);
  };
});

function help(cmd)
{
  if (cmd === "repeat")
    return i18n("Identique à replace hormis le fait que le texte de la sélection ou de str est écrit.\
<br/><br/>repeat(str: String, rgx: String|RegExp, remplace: String, …)");

  if (cmd === "repeatx")
    return i18n("Identique à replacex hormis le fait que le texte de la sélection ou de str est écrit.\
<br/><br/>repeatx(str: String, n: Number, rgx: String|RegExp, …, remplace: String, …)");

  if (cmd === "replace")
    return i18n("Remplace le texte str ou la sélection par les remplace.\
<br/><br/>replace(str: String, rgx: String|RegExp, remplace: String, …)\
<br/>str: Si une sélection existe ce paramètre n'existe pas.\
<br/><br/>exemple:\
<br/>$ replace \"a[i] = i; \" i 0 1 2\
<br/>a[0] = 0; a[1] = 1; a[2] = 2; ");

  if (cmd === "replacex")
    return i18n("Remplace le texte str ou la sélection par les remplace.\
<br/><br/>replacex(str: String, n: Number, rgx: String|RegExp, …, remplace: String, …)\
<br/>str: Si une sélection existe ce paramètre n'existe pas.\
<br/><br/>exemple:\
<br/>$ replace \"a[i] = x; \" 2 i x 0 1 2 2 3 4\
<br/>a[0] = 1; a[2] = 2; a[3] = 4; ");
}
