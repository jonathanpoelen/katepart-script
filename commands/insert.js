/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: insert, insertLeft, insertx, insertxLeft
 */

require("stepper.js")
require("cursor.js")
require("edit.js")
require("leftAlgorithm.js")

function _insert(args, beginFn, fn)
{
  var hasSelection = view.hasSelection();
  editText(args, function(str/*, n, …*/){
    var cursor = view.cursorPosition(),
      newline = str.countLine(),
      cursorLine = cursor.line,
      addLine, prevLine;

    if (beginFn)
      beginFn(cursor);

    for (var i = 1; i < arguments.length; ++i){
      document.insertText(cursor, str);
      var stepper = Stepper(arguments[i] || (document.lines() - cursorLine), cursorLine);
      if (stepper.isNegative())
      {
        prevLine = 0;
        addLine = -1;
      }
      else
      {
        addLine = newline;
        prevLine = newline - 1;
      }

      if (!hasSelection)
        stepper.next();

      var line = 1,
        lines = (document.lines()||1) - 1,
        force = stepper.hasOption("f");
      while (stepper.valid() && lines >= cursor.line)
      {
        if (stepper.onStep(line))
        {
          cursor.line += addLine;
          if (lines < cursor.line)
            break;
          else if (fn && fn(cursor, force) || !force && !document.lineLength(cursor.line))
          {
            cursor.line -= prevLine;
            continue;
          }
          lines += addLine;
          stepper.next();
          document.insertText(cursor, str);
        }
        else
          cursor.line += addLine < 0 ? -1 : 1;
        ++line;
      }

      cursor.line = cursorLine;
    }
  }, true);
}


function insert(/*str, n, …*/)
{
  _insert(arguments);
}


function insertLeft(/*str, n, …*/)
{
  var column;
 _insert(arguments, function(cursor){
    column = document.lineLength(cursor.line) - cursor.column;
  }, function(cursor, force){
    cursor.column = document.lineLength(cursor.line) - column;
    if (force && 0 > cursor.column)
      cursor.column = 0;
    return 0 > cursor.column;
  });
}


function _insertx(args, beginFn, fn)
{
  if(args.length < 1)
    return;

  var cursor = view.cursorPosition(),
  end = document.lines(),
  newline;
  fn = fn || noop;

  if (beginFn)
    beginFn(cursor);

  edit(function(){
    var str = args[0].interpret();
    document.insertText(cursor, str);
    for (var i = 1; i < args.length; ++i){
      newline = str.countLine();
      end += newline - 1;
      cursor.line += newline;
      if (cursor.line >= end)
        document.insertLine(cursor.line, "");
      fn(cursor);
      str = args[i].interpret();
      document.insertText(cursor, str);
    }
  }, [arguments]);
}


function insertx(/*str, …*/)
{
  _insertx(arguments);
}


function insertxLeft(/*str, …*/)
{
  simpleLeftAlgorithm(_insertx, arguments);
}


function noop()
{}


function help(cmd)
{
  if (cmd === "insert")
    return i18n("Insert la sélection ou str jusqu'à ligne_courante + n\
<br/><br/>insert(str: String, n: Stepper, …)\
<br/>str: Si une sélection existe ce paramètre n'existe pas.\
<br/>n: Seul l'option f existe, pour forcer l'insertion dans une ligne vide.");

  if (cmd === "insertLeft")
    return i18n("Identique à insert mais le nombre de caractères à droite reste identique. S'il n'y a pas assez de caractères l'insertion n'est pas faite pour la ligne.\
<br/><br/>insertLeft(str: String, n: Stepper, …)");

  if (cmd === "insertx")
    return i18n("Insert chaque paramètre dans une ligne en descendant.\
<br/><br/>insertx(str: String, …)");

  if (cmd === "insertxLeft")
    return i18n("Identique à insertx mais le nombre de caractères à droite reste identique.\
<br/><br/>insertxLeft(str: String, …)");
}
