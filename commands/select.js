/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: select, between, betweenWrap
 */

require("interpretStr.js")
require("toBoolean.js")
require("range.js")
require("position.js")
require("string-utils.js")


function select(begin, end, exclude, continueIsNotFind)
{
  exclude = toBoolean(exclude);
  begin = interpretStr(begin);
  end = interpretStr(end);
  continueIsNotFind = toBoolean(continueIsNotFind);
  var range = view.hasSelection() ?
    view.selection() :
    new Range(view.cursorPosition(), view.cursorPosition());

  if (begin)
  {
    var cursor = Position.strrfind(range.start, begin, exclude);
    if (cursor.isValid())
      range.start = cursor;
    else if (!continueIsNotFind)
      return;
  }
  else
  {
    range.start.line = 0;
    range.start.column = 0;
  }

  if (end)
  {
    var cursor = Position.strfind(range.end, end, exclude);
    if (cursor.isValid())
      range.end = cursor;
    else if (!continueIsNotFind)
      return;
  }
  else
  {
    range.end.line = document.lines() - 1;
    range.end.column = document.lineLength(range.end.line);
  }

  view.setSelection(range);
  view.setCursorPosition(range.end);
}


function between(s, exclude, continueIsNotFind)
{
  select(s, s, !toBoolean(exclude), continueIsNotFind);
}


function betweenWrap(s, exclude, continueIsNotFind)
{
  select(s, s.reverseWrap(), !toBoolean(exclude), continueIsNotFind);
}


function help(cmd)
{
  if (cmd === "between")
    return i18n("Sélectionne le texte se situant entre 2 chaînes.\
<br/><br/>between(s: String, exclude: Boolean= true, continueIsNotFind: Boolean= false)\
<br/>exclude: Si false le texte entre s sera sélectionné.");

  if (cmd === "betweenWrap")
    return i18n("Sélectionne le texte se situant entre 2 chaînes en remplaçant les caractères [](){}<> de la seconde chaîne par ][)(}{><.\
<br/><br/>betweenWrap(s: String, exclude: Boolean= true, continueIsNotFind: Boolean= false)");

  if (cmd === "select")
    return i18n("Sélectionne le texte entre begin et end compris.\
<br/><br/>select(begin: String, end: String, exclude: Boolean= false, continueIsNotFind: Boolean= false)\
<br/>exclude: Si true le texte représenté par begin et end ne sera pas sélectionné.\
<br/>continueIsNotFind: Si begin ou end n'est pas trouvé et que continueIsNotFind est à faut, alors rien ne se passe.");
}
