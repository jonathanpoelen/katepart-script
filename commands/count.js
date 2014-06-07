/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 10
 * kate-version: 4
 * type: commands
 * functions: countChar, countLine, countWord, countLongWord, countRgx, count
 */

require("object-utils.js")
require("selectionOrLine.js")
require("insertion.js")
require("forEach.js")
require("range.js")


function _count(text, opt, fn)
{
  if (opt === undefined)
  {
    opt = text;
    text = document.text(selectionOrLine());
  }
  insertText(text ? fn(
    opt && -1 !== opt.indexOf("i") ?
      text.interpret() :
      text
  ) : "0");
}


(function(o, window){
  var fnCount = {}, firstFnCount = Object.firstValue(o) || Object;
  forEach(o, function(fn, name){
    var ret = function(text, opt){
      _count(text, opt, fn.fn || fn);
    };
    if (fn.c)
      fnCount[fn.c] = ret;
    window[name] = ret;
  });

  window["count"] = function(opt, text){
    var cFn = opt[0], ci = opt[1];
    if ("i" === cFn)
    {
      var tmp = cFn;
      cFn = ci;
      ci = tmp;
    }
    (fnCount[cFn] || firstFnCount)(text, ci);
  };
})({
  countChar: {c: "c", fn: function(s){
    return s.length;
  }},
  countLine: {c: "l", fn: function(s){
    return s.countLine();
  }},
  countWord: {c: "w", fn: function(s){
    return s.split(/\W/).filter(Boolean).length;
  }},
  countLongWord: {c: "W", fn: function(s){
    return s.split(/[^-_:\w]/).filter(function(s){
      return (/\w/).test(s);
    }).length;
  }}
}, this);


function countRgx(rgx, opt, text){
  _count(text, opt, function(s){
    s.split(RegExp(rgx)).filter(Boolean).length;
  });
};


function help(cmd)
{
  if (cmd === "count")
    return i18n("Compte le nombre de caractères, de lignes, de mots ou de mots longs et l'écrit au niveau du curseur.\
<br/><br/>count(opt: String= 'c', text: undefined|String)\
<br/>opt: c pour caractère ; l pour ligne ; w pour mot ; W pout mot long ; i pour interpréter text.\
<br/>text: Le texte où executer le compteur. Si non spécifiée la sélection ou la ligne sera prise.");

  if (cmd === "countChar")
    return i18n("Compte le nombre de caractères et l'écrit à la position du curseur.\
<br/><br/>countChar(text: String, opt: String= text)\
<br/>opt: Si opt n'est pas défini alors opt égal text et text égal le texte de la sélection ou de la ligne. Si opt comporte un i alors le texte sera interprété.");

  if (cmd === "countLine")
    return i18n("Compte le nombre de lignes et l'écrit à la position du curseur. Voir countChar.\
<br/><br/>countLine(text: String, opt: String= text)");

  if (cmd === "countLongWord")
    return i18n("Compte le nombre de mots longs et l'écrit à la position du curseur. Un mot long est défini par ce qui n'est pas une lettre, un chiffre, _, - et :. Voir countChar.\
<br/><br/>countLongWord(text: String, opt: String= text)");

  if (cmd === "countRgx")
    return i18n("Compte le nombre de fragments après avoir couper la chaîne avec la regex.\
<br/><br/>countRgx(text: String, rgx: RegExp, opt: undefined|String)\
<br/>opt: Si un i est dans opt, alors le texte sera interprété. Si opt est undefined alors text égal la sélection ou la ligne.");

  if (cmd === "countWord")
    return i18n("Compte le nombre de mots et l'écrit à la position du curseur. Un mot est défini par ce qui n'est pas une lettre, un chiffre et un _. Voir countChar.\
<br/><br/>countWord(text: String, opt: String= text)");

}
