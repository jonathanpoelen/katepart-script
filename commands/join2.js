/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: join2
 */

require("each.js")
require("array-utils.js")
require("interpretStr.js")

function join2(delimiter/*, delimiter2, …*/)
{
  if (arguments.length < 2)
    each(function(lines){
      return lines.join(interpretStr(delimiter));
    });
  else
  {
    var a = $M(arguments, interpretStr);
    each(function(lines){
      var str = "";
      for (var i in lines)
        str += lines[i] + a[i%a.length];
      return str;
    });
  }
}

function help(cmd)
{
  if (cmd === "join2")
    return i18n("Joint les lignes sélectionnées ou le document entier par delimiter.\
<br/><br/>join2(delimiter: String= '', …)\
<br/><br/>exemple:\
<br/>je<br/>\
suis<br/>\
un<br/>\
exemple<br/>\
simple\
<br/>$ join2 ' ' -\
<br/>je suis-un exemple-simple");
}
