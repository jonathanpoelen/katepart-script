/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: eval, printEval, insertEval
 */

require("insertion.js")
require("array-utils.js")


function eval()
{
  return (new Function(Array.join.call(arguments, " ")))();
}

function printEval()
{
  insertText(eval.apply(null, arguments));
}

function insertEval()
{
  printEval("return " + Array.join.call(arguments, " "));
}


function help(cmd)
{
  if (cmd === "eval")
    return i18n("Exécute la fonction passée en paramètres\
<br/><br/>eval(…: JSCode)");

  if (cmd === "printEval")
    return i18n("Exécute la fonction passée en paramètres puis affiche le retour à la position courante.\
<br/><br/>printEval(…: JSCode)");

  if (cmd === "insertEval")
    return i18n("Même chose que printEval mais ajoute un return\
<br/><br/>insertEval(…: JSCode)\
<br/>…: Un \"return \" est ajouté devant le code.");
}
