/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: cursor
 */

require("cursor-command.js")

function action(cmd)
{
  if ("cursor" === cmd)
    return {
      category: "Navigation",
      interactive: false,
      text: i18n("Move cursor or create selection"),
      shortcut: "Ctrl+Alt+M",
      interactive: true
    };
}

function help(cmd)
{
  if (cmd === "cursor")
    return i18n("Définit la position du cursor : cursor l,c l,c.\
<br/><br/>cursor(c1: String|Number, c2: String|Number, pos: Boolean= false)\
<br/>c1: Forme l,c : l et c sont optionnels, par défaut la position du curseur. l et c peuvent commencer par '+' ou '-', dans ce cas une opération sera effectuée avec la position actuelle. Ils peuvent également commencer par '*' ou '$' et c'est la position de fin qui sera prise pour reférence (dernière ligne ou dernière colonne de la ligne). '*' ou '$'. Des lettres comme wWlLnNdfspPcBbeu peuvent être ajouté et précédés de nombre (par défaut 1). S'il faut séparer les lettre d'un nombre, utilisé :. w: saute les caractères \\x7E-\\xFFa-zA-Z0-9_. W: saute les caractères -\\x7E-\\xFFa-zA-Z0-9_. l: saute les caractères \\x7E-\\xFFa-zA-Z. L: saute les caractères -\\x7E-\\xFFa-zA-Z. n: saute les caractères \\x7E-\\xFFa-zA-Z0-9. N: saute les caractères -\\x7E-\\xFFa-zA-Z0-9. d: saute les caractères 0-9. f: saute les caractères .0-9. s: saute les caractères espace. p: s'arrête à la ligne de contenant pas de caractère a-zA-Z0-9_. P: s'arrête à la ligne contenant uniquement des caractères d'espacement. c: ce déplace de n caractères. B: si utilise dans c2 fait un getSelectionBlock, sinon ne fait rien. b: Position.start e: Position.end u: ce positionne à la position c1 ou la position courante du curseur. i: positionne le curseur à la position du prochain match.\
<br/>c2: Si c2 définit une sélection, elle se fera avec comme intervalle les valeurs définies par c1 et c2.\
<br/>pos: Permet d'utiliser le curseur 2 comme pointeur après la sélection.\
<br/><br/>exemple:\
<br/>$ cursor ,0 ,*\
<br/>Sélectionne la ligne où se trouve le curseur.\
<br/><br/>exemple:\
<br/>$ cursor -1,0 b,*:,-1\
<br/>Sélectionne la ligne précédente et actuelle mais sans le dernier caractère.\
<br/><br/>exemple:\
<br/>$ cursor ,0 +5,*\
<br/>Sélectionne un bloc de 6 lignes commençant à la ligne actuelle.\
<br/><br/>exemple:\
<br/>$ cursor -p p\
<br/>Sélectionne le paragraphe où se trouve le curseur.\
<br/><br/>exemple:\
<br/>$ cursor b,0 e,*\
<br/>Fait une sélection en bloc à la manière de selectBlock.");
}
