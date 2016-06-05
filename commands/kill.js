/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: kill, killRight, killLeft
 */

require("cursor-command.js")

function kill(c1, c2)
{
  if (c1 && c2)
  {
    cursor(c1, c2);
    view.removeSelectedText();
    return ;
  }
  var c = view.cursorPosition();
  if (c1 || c2)
  {
    c1 = c1 ? cursor(c1) : c;
    c2 = c2 ? cursor(c2) : c;
    if (!c1.equals(c2))
    {
      document.removeText(c1, c2);
      return ;
    }
  }
  document.removeLine(c.line);
}


function killRight()
{
  var cursor = view.cursorPosition();
  var column = document.lineLength(cursor.line);
  if (column === cursor.column)
    document.removeText(cursor.line, cursor.column, cursor.line + 1, 0);
  else
    document.removeText(cursor.line, cursor.column, cursor.line, column);
}


function killLeft()
{
  var cursor = view.cursorPosition();
  if (0 === cursor.column)
    document.removeText(cursor.line - 1, document.lineLength(cursor.line - 1), cursor.line, 0);
  else
    document.removeText(cursor.line, 0, cursor.line, cursor.column);
}

function action(cmd)
{
  if ("killRight" === cmd)
    return {
      category: "Editing",
      interactive: false,
      text: i18n("Delete characters to the right of the cursor"),
      shortcut: "Ctrl+;"
    };
  if ("killLeft" === cmd)
    return {
      category: "Editing",
      interactive: false,
      text: i18n("Delete characters to the left of the cursor"),
      shortcut: "Ctrl+L"
    };
}

function help(cmd)
{
  if (cmd === "kill")
    return i18n("Supprime la ligne ou la sélection représentée par c1 et c2 ou supprime la ligne à la position du curseur ou la sélection.\
<br/><br/>kill(c1: cursor, c2: cursor)");

  if (cmd === "killLeft")
    return i18n("Supprime les caractères à gauche du curseur jusqu'au début de la ligne.\
<br/><br/>killLeft()");

  if (cmd === "killRight")
    return i18n("Supprime les caractères à droite du curseur jusqu'à la fin de la ligne\
<br/><br/>killRight()");
}
