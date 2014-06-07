/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: encodeuri, decodeuri
 */

require("array-utils.js")
require("interpretStr.js")
require("selectionOrLine.js")
require("insertion.js")
require("edit.js")
require("range.js")

var window = this;

function _codeURI(fn, args)
{
  if (args.length) {
    insertText(fn($M(args, interpretStr).join(" ")));
  }
  else {
    document.editBegin();
    var cLast = !view.hasSelection();
    var text = fn(selectionOrLine(false, true).text);
    if (cLast) {
      text += "\n";
    }
    insertText(text);
    document.editEnd();
  }
}

function encodeuri() { _codeURI(encodeURI, arguments); }
function decodeuri() { _codeURI(decodeURI, arguments); }


function help(cmd)
{
  if (cmd === "encodeuri")
    return i18n("Encode la sélection ou la ligne. Si des paramètres sont passés, alors les sépare par des espaces et l'encode.\
<br/><br/>encodeuri()");

  if (cmd === "decodeuri")
    return i18n("Décode la sélection ou la ligne. Si des paramètres sont passés, alors les sépare par des espaces et les décode.\
<br/><br/>decodeuri()");
}
