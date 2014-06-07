/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 10
 * kate-version: 4
 * type: commands
 * functions: set-call-interpret-string
 */

require("interpretStr.js")
require("toBoolean.js")


this["set-call-interpret-string"] = function(v){
  interpretStrIsActiv = toBoolean(v);
};


function help(cmd)
{
  if (cmd === "set-call-interpret-string")
    return i18n("Définit si les chaînes de caractères passées en paramètres dans les fonctions doivent être interprétées.\
<br/><br/>set-call-interpret-string(: Boolean)\
<br/><br/>exemple:\
<br/>$ insertText 'un\\nexemple'\
<br/>un<br/>\
example\
<br/><br/>exemple:\
<br/>$ insertText \"un\\nexemple\"\
<br/>un<br/>\
example\
<br/><br/>exemple:\
<br/>$ insertText un\\nexemple\
<br/>unexample\
<br/><br/>exemple:\
<br/>$ insertText un\\\\nexemple\
<br/>un<br/>\
example");
}
