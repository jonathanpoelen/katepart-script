/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: filename, extension, url, mimeType, encoding, highlightingMode, highlightingModeCursor
 */

require("insertion.js")
require("interpretStr.js")
require("toBoolean.js")
require("document-utils.js")
require("cursor.js")


function filename(noExt)
{
  var name = document.fileName();
  insertText(getName(name, noExt));
}


function extension()
{
  var name = document.fileName(),
    pos = name.lastIndexOf('.');

  if (pos === -1)
    insertText(name.substr(0, pos));
}


function url(nDir, replace, noExt)
{
  var url = document.url();
  if (nDir)
  {
    if (nDir.isYes())
      url = url.substr(url.indexOf("//") + 2);
    else if (nDir = +nDir)
    {
      var pos = url.length, cut = pos;
      while (nDir-- > 0 && -1 !== (pos = url.lastIndexOf('/', pos - 1)))
        cut = pos + 1;
      url = url.substr(cut);
    }
  }
  url = getName(url, noExt);
  insertText("string" === typeof replace ? url.replace(/\//g, interpretStr(replace)) : url);
}

function mimeType() { insertText(document.mimeType()); }
function encoding() { insertText(document.encoding()); }
function highlightingMode() { insertText(document.highlightingMode()); }

function highlightingModeCursor()
{
  var cursor = view.cursorPosition();
  document.insertText(cursor, document.highlightingModeAt(cursor));
}

function help(cmd)
{
  if (cmd === "filename")
    return i18n("Affiche le nom du fichier.<br/><br/>filename(noExt: Boolean=false)<br/>noExt: Supprimer l'extension");

  if (cmd === "extension")
    return i18n("Affiche l'extension du fichier.<br/><br/>extension()");

  if (cmd === "url")
    return i18n("Affiche l'url du fichier.\
<br/><br/>url(nDir: Number|Boolean, replace: String= undefined, noExt: Boolean=false\
<br/>nDir: Nombre de dossiers à prendre en compte. Si Boolean, supprime le protocole de l'url.\
<br/>replace: Si définit alors chaîne qui remplace les caractères '/'\
<br/><br/>exemple:\
<br/>file:///home/poelen/Code/KatePart/doc-script/functions-descriptions.xml\
<br/>$ url 3 _ 1\
<br/>KatePart_doc-script_functions-descriptions");

  if (cmd === "mimeType")
    return i18n("Écrit le mimeType du document à la position du curseur.<br/><br/>mimeType()");

  if (cmd === "encoding")
    return i18n("Écrit l'encodage du document à la position du curseur.<br/><br/>encoding()");

  if (cmd === "highlightingMode")
    return i18n("Écrit la couleur synthaxique du document à la position du curseur.<br/><br/>highlightingMode()");

  if (cmd === "highlightingModeCursor")
    return i18n("Écrit à la position du curseur la couleur synthaxique d'où il se trouve.<br/><br/>highlightingModeCursor()");
}
