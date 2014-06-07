/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: sort2, natsort2, usort, rsort, rnatsort, rusort
 */

require("getCommandOrThrowError.js")
require("toBoolean.js")
require("forEach.js")
require("stepper.js")
require("each.js")


function _sort(_step, caseSensitive, compare)
{
  step = stepper(_step);
  caseSensitive = toBoolean(!step && !caseSensitive ? false : caseSensitive);
  each(function(lines){
    var cmp;
    if (caseSensitive)
    {
      if (!compare)
        compare = window.compare;
      cmp = function(a, b){
        return compare(a.toUpperCase(), b.toUpperCase());
      }
    }
    else
      cmp = compare;
    if (!step)
      return lines.sort(cmp);
    var noSortLine = [];
    return lines.filter(function(v, k){
      if ((step.first + k) % step.modulo)
      {
        noSortLine.push(v);
        return false;
      }
      return true;
    }).sort(cmp).reduce(function(accu, v, k){
      if ((step.first + accu.length) % step.modulo)
        accu.push(noSortLine.shift());
      accu.push(v);
      return accu;
    }, []).concat(noSortLine);
  });
}


function negate(fn, thisp)
{
  return function(){
    return -fn.apply(thisp||fn, arguments);
  }
}


function compare(a, b)
{
  return a === b ? 0 : a < b ? -1 : 1;
}

forEach({
  sort2: undefined,
  natsort2: natcompare,
  rsort: negate(compare),
  rnatsort: negate(natcompare),
}, function (cmp, name){
  window[name] = function(step, caseSensitive){
    _sort(step, caseSensitive, cmp);
  };
});


function _usort(body)
{
  try
  {
    return getCommandOrThrowError(body);
  }
  catch(e)
  {
    return new Function("a", "b", body.indexOf("return") === -1 ? "return "+body : body);
  }
}

function usort(body, step, caseSensitive)
{
  _sort(step, caseSensitive, _usort(body));
}

function rusort(body, step, caseSensitive)
{
  _sort(step, caseSensitive, negate(_usort(body)));
}

 /*
natcompare.js -- Perform 'natural order' comparisons of strings in JavaScript.
Copyright (C) 2005 by SCK-CEN (Belgian Nucleair Research Centre)
Written by Kristof Coomans <kristof[dot]coomans[at]sckcen[dot]be>

Based on the Java version by Pierre-Luc Paour, of which this is more or less a straight conversion.
Copyright (C) 2003 by Pierre-Luc Paour <natorder@paour.com>

The Java version was based on the C version by Martin Pool.
Copyright (C) 2000 by Martin Pool <mbp@humbug.org.au>

This software is provided 'as-is', without any express or implied
warranty.  In no event will the authors be held liable for any damages
arising from the use of this software.

Permission is granted to anyone to use this software for any purpose,
including commercial applications, and to alter it and redistribute it
freely, subject to the following restrictions:

1. The origin of this software must not be misrepresented; you must not
claim that you wrote the original software. If you use this software
in a product, an acknowledgment in the product documentation would be
appreciated but is not required.
2. Altered source versions must be plainly marked as such, and must not be
misrepresented as being the original software.
3. This notice may not be removed or altered from any source distribution.
*/
///@note /usr/share/kde4/apps/katepart/script/utils.js
///@note modification isWhitespaceChar and isDigitChar by Jonathan Poelen

function isWhitespaceChar(a)
{
  return (a.charCodeAt(0) <= 32);
}

function isDigitChar(s)
{
  return (/^\d/).test(s);
}

function compareRight(a, b)
{
  var bias = 0,
    ia = 0, ib = 0,
    ca, cb;

  // The longest run of digits wins.  That aside, the greatest
  // value wins, but we can't know that it will until we've scanned
  // both numbers to know that they have the same magnitude, so we
  // remember it in BIAS.
  for (;; ia++, ib++) {
    ca = a.charAt(ia);
    cb = b.charAt(ib);

    if (!isDigitChar(ca)
        && !isDigitChar(cb)) {
      return bias;
    } else if (!isDigitChar(ca)) {
      return -1;
    } else if (!isDigitChar(cb)) {
      return +1;
    } else if (ca < cb) {
      if (bias === 0) {
        bias = -1;
      }
    } else if (ca > cb) {
      if (bias === 0)
        bias = +1;
    } else if (ca === 0 && cb === 0) {
      return bias;
    }
  }
}

function natcompare(a,b)
{
  var ia = 0, ib = 0,
    nza, nzb,
    ca, cb,
    result;

  while (true)
  {
    // only count the number of zeroes leading the last number compared
    nza = nzb = 0;

    ca = a.charAt(ia);
    cb = b.charAt(ib);

    // skip over leading spaces or zeros
    while ( isWhitespaceChar( ca ) <= 32 || ca ==='0' ) {
      if (ca === '0') {
        nza++;
      } else {
        // only count consecutive zeroes
        nza = 0;
      }

      ca = a.charAt(++ia);
    }

    while ( isWhitespaceChar( cb ) || cb === '0') {
      if (cb === '0') {
        nzb++;
      } else {
        // only count consecutive zeroes
        nzb = 0;
      }

      cb = b.charAt(++ib);
    }

    // process run of digits
    if (isDigitChar(ca) && isDigitChar(cb)
      && 0 !== (result = compareRight(a.substring(ia), b.substring(ib))))
      return result;

    if (ca === 0 && cb === 0) {
      // The strings compare the same.  Perhaps the caller
      // will want to call strcmp to break the tie.
      return nza - nzb;
    }

    if (ca < cb) {
      return -1;
    } else if (ca > cb) {
      return +1;
    }

    ++ia; ++ib;
  }
}


function help(cmd)
{
  if (cmd === "sort2")
    return i18n("Trie les lignes de la sélection ou l'ensemble du document.\
<br/><br/>sort2(step: stepper|Boolean, caseSensitive: Boolean= false)\
<br/>caseSensitive: Si step n'est pas du type stepper et que caseSensitive est faux, alors caseSensitive = false");

  if (cmd === "usort")
    return i18n("Trie les lignes de la sélection ou l'ensemble du document via une fontion.\
<br/><br/>usort(body: Strting, step: stepper|Boolean, caseSensitive: Boolean= false)\
<br/>body: Correspond au nom d'une fonction ou d'un corps de fonction. Si body est un corps de fonction et que return n'existe pas, il est ajouté au début. 2 paramètrte sont passé à la fonction : a et b.\
<br/><br/>exemple:\
<br/>d<br/>\
b<br/>\
a<br/>\
c<br/>\
e\
<br/>$ usort 'compare(a, b)'\
<br/>a<br/>\
b<br/>\
c<br/>\
d<br/>\
e");

  if (cmd === "natsort2")
    return i18n("Trie les lignes de la sélection ou l'ensemble du document par ordre naturel.\
<br/><br/>natsort2(step: stepper|Boolean, caseSensitive: Boolean= false)");

  if (cmd === "rnatsort")
    return i18n("Trie les lignes de la sélection ou l'ensemble du document par ordre naturel inversé.\
<br/><br/>rnatsort(step: stepper|Boolean, caseSensitive: Boolean= false)");

  if (cmd === "rsort")
    return i18n("Trie les lignes de la sélection ou l'ensemble du document par ordre inverse.\
<br/><br/>rsort(step: stepper|Boolean, caseSensitive: Boolean= false)");

  if (cmd === "rusort")
    return i18n("Trie inverse de usort.\
<br/><br/>rusort(body: Strting, step: stepper|Boolean, caseSensitive: Boolean= false)");
}
