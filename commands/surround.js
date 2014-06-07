/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: set-surround-ignore-whitespace, outer, unouter, surround, unsurround, surround2, unsurround2, rsurround, unrsurround, rsurround2, unrsurround2
 */

require("array-utils.js")
require("edit.js")


function getSelectionLineNonWhitespace(line)
{
  return new Range(line, document.firstColumn(line), line, (document.lastColumn(line)+1) || -1);
}


function selectionOrLineNonWhitespace()
{
  return view.hasSelection() ? view.selection() : getSelectionLineNonWhitespace(view.cursorPosition().line);
}


function _insertOuter(selection, array2text)
{
  document.insertText(selection.end, array2text[1]);
  document.insertText(selection.start, array2text[0]);

  if (view.hasSelection())
  {
    var countLine1 = array2text[0].countLine();
    var countLine2 = array2text[1].countLine();
    if (countLine2 !== 1)
      selection.end.column = array2text[1].length - array2text[1].lastIndexOf("\n") - 1;
    else
    {
      if (selection.start.line === selection.end.line)
      {
        selection.end.column += array2text[0].length;
        if (countLine1 !== 1)
          selection.end.column -= array2text[0].lastIndexOf("\n") + 1;
      }
      selection.end.column += array2text[1].length;
    }
    selection.end.line += countLine1 + countLine2 - 2;
    view.setSelection(selection);
  }
}


function _uninsertOuterNoSafe(selection, text, array2text)
{
  document.removeText(selection);
  text = text.substring(array2text[0].length, text.length - array2text[1].length);
  document.insertText(selection.start, text);
  if (view.hasSelection())
  {
    var countLine = text.countLine();
    if (countLine === 1)
    {
      selection.end.column = selection.start.column + text.length;
      selection.end.line = selection.start.line;
    }
    else
    {
      selection.end.line = selection.start.line + countLine;
      selection.end.column = text.length - text.lastIndexOf("\n") - 1;
    }
    view.setSelection(selection);
  }
}


function _uninsertOuter(selection, array2text)
{
  var text = document.text(selection);
  if (text.substr(0, array2text[0].length) === array2text[0] && text.substr(text.length - array2text[1].length) === array2text[1])
    _uninsertOuterNoSafe(selection, text, array2text);
}

function _outer(args)
{
  var middle = Math.round(args.length/2);
  return [
    $A(args, 0, middle).map(interpretStr).join(" "),
    $A(args, middle).map(interpretStr).join(" ")
  ];
}


var ignoreSurroundWhitespace = true;

this["set-surround-ignore-whitespace"] = function(ignore){
  ignoreSurroundWhitespace = toBoolean(ignore);
}

function _outerSelection()
{
  return (ignoreSurroundWhitespace ? selectionOrLineNonWhitespace : selectionOrLine)();
}

function outer(/*text, …*/){
  edit(_insertOuter, [_outerSelection(), _outer(arguments)]);
};

function unouter(/*text, …*/){
  edit(_uninsertOuter, [_outerSelection(), _outer(arguments)]);
};

function _surround(fnText, args)
{
  var text = $M(args, interpretStr).join(" ");
  edit(_insertOuter, [_outerSelection(), [text, fnText(text)]]);
}

function _unsurround(fnText, args)
{
  var text = $M(args, interpretStr).join(" ");
  var selection = _outerSelection();
  if (args.length)
    edit(_uninsertOuter, [selection, [text, fnText(text)]]);
  else
  {
    var text = document.text(selection), ptext, mtext, array2text;
    for (var i = 1, i2 = text.length - 1; i < i2; ++i, --i2){
      ptext = text.substr(0, i);
      mtext = fnText(ptext);
      if (mtext === text.substr(i2)){
        array2text = [ptext, mtext];
      } else {
        if (array2text)
          edit(_uninsertOuterNoSafe, [selection, text, array2text]);
        break;
      }
    }
  }
}

function _surround_right_text  (text){return text.reverseWrap()}
function _rsurround_right_text (text){return text.reverseWrap().reverse()}
function _surround2_right_text (text){return text}
function _rsurround2_right_text(text){return text.reverse()}

function surround  (/*text, …*/){_surround(_surround_right_text,   arguments)}
function rsurround (/*text, …*/){_surround(_rsurround_right_text,  arguments)}
function surround2 (/*text, …*/){_surround(_surround2_right_text,  arguments)}
function rsurround2(/*text, …*/){_surround(_rsurround2_right_text, arguments)}

function unsurround  (/*text, …*/){_unsurround(_surround_right_text,   arguments)}
function unrsurround (/*text, …*/){_unsurround(_rsurround_right_text,  arguments)}
function unsurround2 (/*text, …*/){_unsurround(_surround2_right_text,  arguments)}
function unrsurround2(/*text, …*/){_unsurround(_rsurround2_right_text, arguments)}

function help(help)
{
  if (cmd === "outer")
    return i18n("Met le texte de la ligne ou de la sélection au milieu des chaînes passées en paramètres.\
<br/><br/>outer(text: String, …)\
<br/><br/>exemple:\
<br/>plop\
<br/>$ outer a\
<br/>aplop\
<br/><br/>exemple:\
<br/>plop\
<br/>$ outer [ ]\
<br/>[plop]");

  if (cmd === "surround")
    return i18n("Entoure le texte de la sélection ou de la ligne avec les chaînes passées en paramètres en remplaçant les caractères [](){}<> par ][)(}{><\
<br/><br/>surround(text: String, …)\
<br/><br/>exemple:\
<br/>plop\
<br/>$ surround a\
<br/>aplopa\
<br/><br/>exemple:\
<br/>plop\
<br/>$ surround a b c\
<br/>a b cplopa b c");

  if (cmd === "rsurround")
    return i18n("Identique à surround mais inverse l'ordre des caractères de la seconde chaîne.\
<br/><br/>rsurround(text: String, …)");

  if (cmd === "unouter")
    return i18n("Supprime le texte qui entoure la sélection ou la ligne qui est identique au chaînes passées en paramètres (inverse de outer).\
<br/><br/>unouter(text: String, …)");

  if (cmd === "unrsurround")
    return i18n("Supprime le texte qui entoure la sélection ou la ligne qui est identique au chaînes passées en paramètres (inverse de rsurround).\
<br/><br/>unrsurround(text: String, …)");

  if (cmd === "unsurround2")
    return i18n("Supprime le texte qui entoure la sélection ou la ligne qui est identique au chaînes passées en paramètres (inverse de surround).\
<br/><br/>unsurround2(text: String, …)");
}
