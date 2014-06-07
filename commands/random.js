/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 10
 * kate-version: 4
 * type: commands
 * functions: random
 */

require("insertion.js")

function random(min, max, fixed)
{
  min = +min || 0;
  insertText((Math.random() * ((+max || 99) - min) + min).toFixed(fixed));
}

function help(cmd)
{
  if (cmd === "random")
    return i18n("Affiche au hasart un chiffre comprit entre min et max.\
<br/><br/>random(min: Number= 0, max: Number= 99, fixed: Number= 0)\
<br/>fixed: Nombre de signe significatif après la virgule");
}
