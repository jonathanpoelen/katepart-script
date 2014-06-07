/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: reverseLine, reverseWord, reverse
 */

require("removeThenInsertText.js")
require("selectionOrLine.js")
require("cursor-utils.js")
require("string-utils.js")
require("array-utils.js")
require("toBoolean.js")


function reverseLine(jump, step, prepend)
{
  if (view.hasSelection())
  {
    jump = Math.abs(jump) || 1;
    var selection = getSelectionBlock(),
      lines = document.text(selection).split("\n");

    if (jump !== 1)
    {
      step = (+step||0) + (+prepend ? 0 : jump - lines.length % jump);
      lines = lines.reduce(function(accu, line, k){
        if ((k + step) % jump && undefined !== accu[accu.length-1])
          accu[accu.length-1] += "\n"+line;
        else
          accu.push(line);
        return accu;
      }, []);
    }
    removeRangeThenInsertText(selection, lines.reverse().join("\n"));
  }
}


function reverseWord(jump, _step, prepend, boundaryBegin, boundaryEnd)
{
  jump = Math.abs(jump) || 1;
  boundaryBegin = toBoolean(boundaryBegin);
  boundaryEnd = toBoolean(boundaryEnd);
  _step = ~~_step;
  prepend = toBoolean(prepend);
  var selection = selectionOrLine();
  removeRangeThenInsertText(
    selection,
    document.text(selection).eachLine(function(line){
      var words,
        indexBegin = boundaryBegin ? 0 : line.search(/\b/),
        indexEnd = line.length - (boundaryEnd ? 0 : line.replace(/.*(\b)/, "$1").length),
        fragment = line.substring(indexBegin, indexEnd).split(/\b/);
      if (1 !== jump)
      {
        var step = _step + (prepend ? 0 : jump - fragment.reduce(function(accu, word){
          return accu + word.isAlphanumeric();
        }, 0) % jump);
        words = [];
        var i = 0;
        fragment = fragment.reduce(function(accu, word){
          if (word.isAlphanumeric())
          {
            if ((i + step) % jump)
            {
              Array.concatEnd(accu, word);
              Array.concatEnd(words, word);
            }
            else
            {
              accu.push(word);
              words.push(word);
            }
            ++i;
          }
          else
          {
            Array.concatEnd(accu, word);
            Array.concatEnd(words, word);
          }
          return accu;
        }, []);
        if ((/\b$/).test(fragment[fragment.length - 1]))
        {
          var backspace;
          for (var i in words)
          {
            if (words[i].isAlphanumeric())
            {
              backspace = words[i].split(/.*\b/)[1];
              words[i] = words[i].substring(0, words[i].length - backspace.length);
              break;
            }
          }
          for (var i = words.length - 1; i >= 0; --i)
          {
            if (words[i].isAlphanumeric())
            {
              words[i] += backspace;
              break;
            }
          }
        }
      }
      else
        words = line.split(/[^\w]/).filter(Boolean);
      return (indexBegin > 0 ? line.substring(0, indexBegin) : "") +
        fragment.reduce(function(accu, word){
          return accu + (word.isAlphanumeric() ? words.pop() : word);
        }, "") + line.substr(indexEnd);
    })
  );
}


function reverseLetter(line, fn){
  return (fn||Object)(line.split("")).reverse().join("");
};


function reverse(jump, _step, prepend)
{
  jump = Math.abs(jump) || 1;
  _step = ~~_step;
  prepend = toBoolean(prepend);
  var selection = selectionOrLine();
  removeRangeThenInsertText(
    selection,
    document.text(selection).eachLine(1 === jump ?
      reverseLetter :
      function(line){
        return reverseLetter(line, function(letters){
          step = _step + (prepend ? 0 : jump - letters.length % jump);
          return letters.reduce(function(accu, letter, k){
            if ((k + step) % jump)
              accu[accu.length-1] += letter;
            else
              accu.push(letter);
            return accu;
          }, [""]);
        });
      }
    )
  );
}


function help(cmd)
{
  if (cmd === "reverse")
    return i18n("Inverse la position des lettres de chaque ligne de sélection ou de la ligne où se trouve le curseur.\
<br/><br/>reverse(group: Number= 1, step: Number= 0, prepend: Boolean= false)\
<br/><br/>exemple:\
<br/>un exemple\
<br/>$ reverse\
<br/>elpmexe nu");

  if (cmd === "reverseLine")
    return i18n("Inverse la position des lignes de la sélection.\
<br/><br/>reverseLine(group: Number= 1, step: Number= 0, prepend: Boolean= false)\
<br/>group: Grouper les lignes de taille de group\
<br/>step: Ignorer le reverse des lignes toutes les step fois\
<br/>prepend: Si 0, step += jump - lines.length % jump\
<br/><br/>exemple:\
<br/>un<br/>\
exemple<br/>\
simple<br/>\
de<br/>\
reverseLine\
<br/>$ reverseLine\
<br/>reverseLine<br/>\
de<br/>\
simple<br/>\
exemple<br/>\
un\
<br/><br/>exemple:\
<br/>un<br/>\
exemple<br/>\
simple<br/>\
de<br/>\
reverseLine\
<br/>$ reverseLine 2\
<br/>de<br/>\
reverseLine<br/>\
exemple<br/>\
simple<br/>\
un\
<br/><br/>exemple:\
<br/>un<br/>\
exemple<br/>\
simple<br/>\
de<br/>\
reverseLine\
<br/>$ reverseLine 3 2\
<br/>de<br/>\
reverseLine<br/>\
un<br/>\
exemple<br/>\
simple\
<br/><br/>exemple:\
<br/>un<br/>\
exemple<br/>\
simple<br/>\
de<br/>\
reverseLine\
<br/>$ reverseLine 3 2 1\
<br/>reverseLine<br/>\
exemple<br/>\
simple<br/>\
de<br/>\
un");

  if (cmd === "reverseWord")
    return i18n("Inverse la position des mots de chaque ligne de la sélection ou de la ligne où se trouve le curseur.\
<br/><br/>reverseWord(group: Number= 1, step: Number= 0, prepend: Boolean= false, boundaryBegin: Boolean= false, boundaryEnd: Boolean= false)\
<br/>boundaryBegin: Ignorer les espaces de début\
<br/>boundaryEnd: Ignorer les espaces de fin\
<br/><br/>exemple:\
<br/>je suis un exemple\
<br/>$ reverseWord\
<br/>exemple un suis je");
}
