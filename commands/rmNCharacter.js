/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: rmNCharacter, rmNCharacterLeft
 */

require("leftAlgorithm.js")
require("stepper.js")
require("range.js")


function _rmNCharacter(args_, begin, fn)
{
  var cursor = view.cursorPosition(),
    cursorLine = cursor.line,
    n, args, len;

  if (view.hasSelection())
  {
    len = args_.length;
    args = new Array(len + 1);
    var selection = view.selection();
    args[0] = rangeLength(selection);
    if (selection.end.equals(cursor))
      args[0] = -args[0];
    for (var i = 0; i < len; ++i)
      args[i+1] = args_[i];
  }
  else
    args = args_;

  len = args.length;
  for (var i = 0; i < len; i+=2)
  {
    if (!(n = +args[i]) || isNaN(n))
      continue;
    var stepper = Stepper(args[i+1] || args[i-1] || 1, cursorLine),
      isNegative = stepper.isNegative(),
      force = stepper.options("f"),
      lineStep = -1,
      nIsPositif = n > 0,
      addLine = stepper.isNegative() ? -1 : 1,
      line, column;

    if (begin)
      begin(cursor);

    document.editBegin();
    while (stepper.valid())
    {
      ++lineStep;
      if (stepper.onStep(lineStep))
      {
        if (fn)
          fn(cursor);
        line = cursor.line;
        column = cursor.column + n;
        if (nIsPositif)
        {
          if (force)
          {
            var lineLength = document.lineLength(line);
            if (column > lineLength - 1)
            {
              column = lineLength - cursor.column;
              var lines = document.lines(),
                c = column;
              while (c < n && ++line !== lines)
              {
                lineLength = document.lineLength(line);
                column = n - c - 1;
                c += lineLength;
              }
            }
          }
        }
        else
        {
          if (column < 0)
          {
            if (force)
            {
              var c = -cursor.column,
                lines = document.lines(),
                lineLength;
              column = 0;
              while (c > n && --line !== 0)
              {
                lineLength = document.lineLength(line);
                column = lineLength - n;
                c -= lineLength;
              }
              document.removeText(line, column, cursor.line, cursor.column);
              cursor.line = line + addLine
              stepper.next();
              continue;
            }
            else
              column = 0;
          }
        }
        document.removeText(line, column, cursor.line, cursor.column);
        stepper.next();
      }
      cursor.line += addLine;
    }
    cursor.line = cursorLine;
    document.editEnd();
  }
}


function rmNCharacter(/*n, lines, n, lines, …*/)
{
  _rmNCharacter(arguments);
}


function rmNCharacterLeft(/*n, lines, n, lines, …*/)
{
  simpleLeftAlgorithm(_rmNCharacter, arguments);
}


function help(cmd)
{
  if (cmd === "rmNCharacter")
    return i18n("Supprime n caractères à gauche si négatif ou n caractères à droite si positif.\
<br/><br/>rmNCharacter(n: Number, stepper: Stepper= '1', …)\
<br/>stepper: L'option f permet de forcer la suppression sur les lignes suivantes.\
<br/>…: Si le nX ne possède pas de stepper alors ce dernier est égal à argument[argument.length-2] || '1'.");

  if (cmd === "rmNCharacterLeft")
    return i18n("Identique à rmNCharacter mais le nombre de caractères à droite reste identique.\
<br/><br/>rmNCharacterLeft(n: Number, stepper: Stepper= '1', …)");
}
