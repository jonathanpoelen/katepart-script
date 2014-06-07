/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: detach, detachLeft
 */

require("edit.js");
require("stepper.js");
require("leftAlgorithm.js");
require("range.js");

function _detach(args, beginFn, fn)
{
  var hasSelection = view.hasSelection();
  editText(args, function(str/*, n, …*/){
    var cursor = view.cursorPosition(),
      newline = str.countLine() - 1,
      cursorLine = cursor.line,
      firstColumn = newline ? str.lastIndexOf('\n') - 1 : str.length,
      lastColumn = newline ? str.length - firstColumn - 2 - cursor.column : firstColumn,
      addLine, remove;

    if (beginFn)
      beginFn(cursor);

    for (var i = 1; i < arguments.length; ++i)
    {
      var stepper = Stepper(arguments[i] || (document.lines() - cursorLine), cursorLine),
        line = 1,
        lines = (document.lines()||1) - 1,
        force = stepper.options("f"),
        move = newline && stepper.options("m"),
        removeLeft = stepper.options("l"),
        from, to;
      addLine = stepper.isNegative() ? -1 : 1;

      if (hasSelection)
        cursor.line += newline + 1;
      while (stepper.valid() && lines >= cursor.line)
      {
        if (stepper.onStep(line))
        {
          remove = false;
          if (fn)
            fn(cursor);
          if (removeLeft)
          {
            from = new Cursor(cursor.line - newline, cursor.column - firstColumn);
            to = cursor;
            if (from.column < 0 ? str.substr(-from.column) === document.text(from.line, from.column = 0, cursor.line, cursor.column) : document.text(from, to) === str)
              remove = true;
          }
          else
          {
            from = cursor;
            to = new Cursor(cursor.line + newline, cursor.column + lastColumn);
            var text = document.text(from, to);
            var remove = false;
            if (force)
            {
              var column = document.lineLength(to.line);
              if (column < to.column ? text === str.substr(0, str.length - to.column + column) : text === str)
                remove = true;
            }
            else if (text === str)
              remove = true;
          }
          if (remove)
          {
            document.removeText(from, to);
            if (move)
              cursor.line -= addLine;
          }
          stepper.next();
        }
        cursor.line += addLine;
        ++line;
      }

      cursor.line = cursorLine;
    }
  }, false);
}


function detach(/*str, n, …*/)
{
  _detach(arguments);
}


function detachLeft(/*str, n, …*/)
{
  simpleLeftAlgorithm(_detach, arguments);
}


function help(cmd)
{
  if (cmd === "detach")
    return i18n("Supprime la sélection ou str jusqu'à ligne_courante + n.\
<br/><br/>detach(str: String, n: Stepper, …)\
  <br/>n: 3 options disponibles : f pour supprimé les textes incomplet car il n'y a pas assez de caractère dans la ligne. m quand str est multiligne permet de ne pas passé à la ligne suivante. l qui permet de supprimé les caractères ce trouvant à gauche du curseur.\
<br/><br/>exemple:\
<br/>plop<br/>\
pl[cursor]op<br/>\
plop<br/>\
plop<br/>\
plop\
<br/>$ detach o 3\
<br/>plop<br/>\
pl[cursor]p<br/>\
plp<br/>\
plp<br/>\
plop\
<br/><br/>exemple:\
<br/>plop<br/>\
pl[cursor]op<br/>\
plopidou<br/>\
plop<br/>\
plop\
<br/>$ detach opi f3\
<br/>plop<br/>\
pl[cursor]<br/>\
pldou<br/>\
pl<br/>\
plop");

  if (cmd === "detachLeft")
    return i18n("Identique à detach mais le nombre de caractères à droite reste identique.\
<br/><br/>detachLeft(str: String, n: Stepper, …)");
}
