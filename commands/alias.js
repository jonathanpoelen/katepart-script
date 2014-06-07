/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: createFunction, alias, execFunction
 */

require("array-utils.js")
require("getCommandOrThrowError.js")


function createFunction(name/*[arg1[, ... argN],] functionBody*/)
{
  functions[name] = Function.apply(null, $A(arguments, 1));
}


function alias(name/*[, arg1[, ... argN]], commandReference*/)
{
  var p = name[0] === ':';
  var args = $A(arguments, 1, -1);
  var commandReference = arguments[arguments.length - 1];
  functions[p ? name.substr(1) : name] = (function(commandReference, args, p){
    return function(){
      return getCommandOrThrowError(commandReference).apply(null, p ? $A(arguments).concat(args) : args.concat($A(arguments)));
    };
  })(commandReference, args, p)
}


function execFunction(name/*[, arg1[, ... argN]]*/)
{
  functions[name]($A(arguments, 1));
}


function help(cmd)
{
  if (cmd === "alias")
    return i18n("Créer un alias sur commandReference et ajoute à chaque appel les arguments avant ceux passés à la fonction aliasée.. Si la première lettre de name est ':' alors les arguments sont ajoutés après ceux passés à la fonction aliasée.\
<br/><br/>alias(name: String", +"[params: mixed, …]\", commandReference: String)");

  if (cmd === "createFunction")
    return i18n("Créer une fonction qui pourra être executée avec execFunction ou via les commandes demandant des fonctions.\
<br/><br/>createFunction(name: String", +"[params: mixed, …]\", body: JSCode\
)");

  if (cmd === "execFunction")
    return i18n("Exécute une commande créée par createFunction ou alias.\
<br/><br/>execFunction(name: String", +"[params: mixed, …]\")");
}
