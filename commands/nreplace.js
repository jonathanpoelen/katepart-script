/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 10
 * kate-version: 4
 * type: commands
 * functions: nreplace, nreplaceLeft
 */

require("range.js");


function _nreplace(rm, insert, args)
{
  var i = 0;
  document.editBegin();
  if (view.hasSelection())
  {
    rm(args[1]);
    view.clearSelection(); //sinon insert ne fonctionne pas (?)
    insert(args[0], args[1]);
    i = 2;
  }
  while (i < args.length)
  {
    rm(args[i++], args[i+1] || args[i-2]);
    insert(args[i++], args[i++] || args[i-2]);
  }
  document.editEnd();
}


function nreplace(/*ndel, insert, lines, ndel, insert, lines, …*/)
{
  _nreplace(rmNCharacter, insert, arguments);
}

function nreplaceLeft(/*ndel, insert, lines, ndel, insert, lines, …*/)
{
  _nreplace(rmNCharacterLeft, insertLeft, arguments);
}


function help(cmd)
{
  if (cmd === "nreplace")
    return i18n("Utilise rmNCharacter puis insert.\
<br/><br/>nreplace(n: Number, str: String, line: Stepper, …)\
<br/>n: Paramètre passé à rmNCharacter.\
<br/>str: Paramètre passé à insert.\
<br/>line: Paramètre passé à rmNCharacter puis insert.");

  if (cmd === "nreplaceLeft")
    return i18n("Identique à nreplace mais le nombre de caractères à droite reste identique.\
<br/><br/>nreplaceLeft(n: Number, str: String, line: Stepper, …)");
}
