/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: rmLinesWithOnly, rmText, rmTextOf
 */

require("array-utils.js")
require("removeThenInsertText.js")
require("each.js")
require("range.js")


function _rmTextSelection(array, isOf)
{
  removeRangeThenInsertText(
    view.selection(),
    view.selectedText().replace(
      array.length ?
        RegExp(
          isOf ?
            "["+array.map(function(c){
              return c.split("").join("|")
            }).join("|")+"]" :
            array.map(function(str){
              return str.replace(/([\(|\)|\||\[|\]|\\])/g, "\\$1")
            }).join("|"),
          "g"
        ) : (/[ \t\n\r\v\b\f]/g),
      ""
    )
  );
}


function rmText()
{
  var texts = $M(arguments, interpretStr).filter(Boolean);
  if (view.hasSelection())
    _rmTextSelection(texts);
  else
  {
    if (!texts.length)
      return rmTextOf();

    var cursor = view.cursorPosition(),
      from = cursor.clone(),
      to = from.clone();
    while (from.line >= 0)
    {
      var indexes = texts.map(function(v,k){return k}),
        endPos = 1;
      do
      {
        if (from.column - 1 < 0)
        {
          from.column = document.lineLength(--from.line) - 1;
          if (from.line < 0)
          {
            indexes = [];
            break;
          }
          continue;
        }
        --from.column;
        var c = document.charAt(from),
          accu = [];
        for (var i in indexes)
        {
          i = indexes[i];
          if (texts[i][texts[i].length - endPos] === c)
          {
            accu.push(i);
            if (texts[i].length === endPos)
            {
              cursor = from.clone();
              break;
            }
          }
        }
        indexes = accu;
        ++endPos;
      } while (indexes.length && cursor.compareTo(from));
      if (!indexes.length)
      {
        from = cursor.clone();
        break;
      }
    }

    var lines = document.lines();
    cursor = to.clone();

    while (to.line < lines)
    {
      var indexes = texts.map(function(v,k){return k}),
        pos = 0,
        length = document.lineLength(to.line);
      do
      {
        if (to.column >= length)
        {
          if (++to.line >= lines)
          {
            indexes = [];
            break;
          }
          to.column = 0;
          continue;
        }
        var c = document.charAt(to),
          accu = [];
        for (var i in indexes)
        {
          i = indexes[i];
          if (texts[i][pos] === c)
          {
            accu.push(i);
            if (texts[i].length === pos + 1)
            {
              cursor = to.clone();
              ++cursor.column;
              break;
            }
          }
        }
        indexes = accu;
        ++pos;
        ++to.column;
      } while (indexes.length && cursor.compareTo(to));
      if (!indexes.length)
      {
        to = cursor.clone();
        break;
      }
    }

    document.removeText(from, to);
  }
}


function rmTextOf()
{
  var characters = $M(arguments, interpretStr);
  if (view.hasSelection())
  {
    if (arguments.length > 1)
      characters.push(" ");
    _rmTextSelection(characters, true);
  }
  else
  {
    if (characters.length)
    {
      characters = characters.join("");
      if (arguments.length > 1)
        characters += " ";
    }
    else
      characters = " \t\n\r";

    var from = view.cursorPosition(),
      to = from.clone(),
      run = true,
      runContinue = function(cursor){
        return -1 !== characters.indexOf(document.charAt(cursor));
      };

    while (from.line >= 0 && run)
    {
      do
      {
        if (--from.column < 0)
        {
          if (--from.line < 0)
            from.line = from.column = 0;
          else
            from.column = document.lineLength(from.line) - 1;
          break;
        }
      } while (run = runContinue(from));
      ++from.column;
    }

    if (run = runContinue(to))
    {
      var lines = document.lines();

      while (to.line < lines && run)
      {
        var length = document.lineLength(to.line);
        do
        {
          if (to.column++ >= length)
          {
            ++to.line;
            to.column = 0;
            break;
          }
        } while (run = runContinue(to));
      }
    }

    document.removeText(from, to);
  }
}


function rmLinesWithOnly(/*toFind, …*/)
{
  if (!arguments.length)
  {
    //rmblank
    each(function(lines){
      return lines.filter(Boolean);
    });
    return;
  }

  var allFind = $M(arguments, interpretStr),
    rmEmpty = true;
  if (-1 !== allFind.indexOf(""))
    allFind = allFind.filter(Boolean);
  else
    rmEmpty = false;

  each(function(lines){
    if (rmEmpty)
      lines = lines.filter(Boolean);
    if (toFind && toFind.length)
      lines = lines.filter(function(line){
        return line ? !toFind.some(function(letters){
          for (var i = 0; i < line.length; ++i)
            if (-1 === letters.indexOf(line[i]))
              return false;
          return true;
        }) : !rmEmpty;
      });
    return lines;
  });
}


function help(cmd)
{
  if (cmd === "rmLinesWithOnly")
    return i18n("Supprime les lignes de la sélection ou de l'ensemble du document qui comporte tous les caractères d'un des arguments\
<br/><br/>rmLinesWithOnly(toFind: String= '', …)\
<br/>toFind: Si une chaîne vide alors supprime les lignes vides.");

  if (cmd === "rmText")
    return i18n("Supprime des fragments de chaîne soit de la sélection soit directement autour du curseur.\
<br/><br/>rmText(text: String= ' ', …)");

  if (cmd === "rmTextOf")
    return i18n("Identique à rmText mais les fragments de texte sont les caractères.\
<br/><br/>rmTextOf(text: String= ' \\t\\v', …)\
<br/>…: Si plusieurs paramètres sont présents, le caractère espace est ajouté.");
}
