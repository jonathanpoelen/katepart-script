/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: slice
 */

require("array-utils.js")
require("interpretStr.js")
require("removeThenInsertText.js")
require("selectionOrLine.js")
require("range.js")


function StopEach(){}

function slice(delimiter/*, size1, …, sizeN*/)
{
  var sizef;
  if (arguments.length < 2)
    sizef = 1;
  else if (!(sizef = $A(arguments, 1).reduce(function(accu, v){
    if (v = Math.abs(~~v))
      accu.push(v);
    return accu;
  }, [])).length)
    return;

  var strf, selection = selectionOrLine(), text = document.text(selection);
  if (1 === sizef)
    strf = text.split("");
  else if (1 === sizef.length)
    strf = text.split(RegExp("(.{"+sizef[0]+"})")).filter(Boolean);
  else
  {
    strf = [];
    try
    {
      var pos = 0;
      while (pos < text.length - 1)
      {
        sizef.forEach(function(size){
          strf.push(text.substr(pos, size));
          pos += size;
          if (pos >= text.length)
            throw StopEach();
        });
      }
    }
    //catch (err if err instanceof StopEach){}
    catch (err){}
  }
  removeRangeThenInsertText(selection, strf.join(
    delimiter ? interpretStr(delimiter) : " "
  ));
}

function help(cmd)
{
  if (cmd === "slice")
    return i18n("Coupe le texte de la sélection ou de la ligne en morceaux de taille définie par size.\
<br/><br/>slice(delimiter: String= ' ', size: Number= 1, …)\
<br/>delimiter: chaîne qui va délimiter les morceaux\
<br/><br/>exemple:\
<br/>abcde\
<br/>$ slice , 1\
<br/>a,b,c,d,e\
<br/><br/>exemple:\
<br/>abcde\
<br/>$ slice \"', '\" 1\
<br/>a', 'b', 'c', 'd', 'e");
}
