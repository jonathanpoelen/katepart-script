/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: set-string-or-regex, set-regex-or-string
 */

require("stringOrRegex.js")


var intelligentStringOrRegex = function(value, flag){
  try {
    return new RegExp(value, flag);
  }
  catch (e){
    return ""+value;
  }
}

this["set-string-or-regex"] = function(v){
  stringOrRegex = v[0] === "s" ? _stringOrRegex : v[0] === "r" ? _regexOrString : intelligentStringOrRegex;
}
this["set-regex-or-string"] = function(v){
  regexOrString = v[0] === "s" ? _stringOrRegex : v[0] === "r" ? _regexOrString : intelligentStringOrRegex;
}


function help(cmd)
{
  if (cmd === "set-regex-or-string")
    return i18n("Définit le type des paramètres de type String|RegExp. Par défaut RegExp.\
<br/><br/>set-regex-or-string(c: char= undefined)");

  if (cmd === "set-string-or-regex")
    return i18n("Définit le type des paramètres de type String|RegExp. Par défaut String.\
    <br/><br/>set-string-or-regex(c: char= undefined)\
<br/>c: Si c = 's' alors définit des String, sinon si c = 'r' définit des RegExp sinon définit une fonction qui transforme en RegExp si la chaîne est valide.");
}
