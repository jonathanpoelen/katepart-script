const katescript = {
  "author": "Jonathan Poelen <jonathan.poelen+katescript@gmail.com>",
  "license": "BSD",
  "revision": 3,
  "kate-version": "5.1",
  "functions": ["tr", "tr/I", "tr/i", "tr/l", "tr/u"],
  "actions": [
    { "function": "tr"
    , "name": "Translate or delete characters"
    , "category": "Editing"
    }
  ]
};

require("jln/selectionOrLineProcess.js")
require("jln/interpretStr.js")
require("jln/toBoolean.js")
require("jln/regex-utils.js")
require("jln/string-utils.js")


function tr(findTo, replaceTo, empty, rgxFlags)
{
  if (!findTo)
    return;

  replaceTo = (replaceTo === undefined && findTo.length !== 1)
    ? interpretStr(findTo).reverse()
    : replaceTo
    ? interpretStr(replaceTo)
    : '';
  empty = toBoolean(empty);

  selectionOrLineProcess(true, true, function(text) {
    const re = new RegExp('[' + RegExp.escape(findTo) + ']', rgxFlags || 'g');
    const repLen = replaceTo.length;

    if (repLen === 0 || (repLen === 1 && (!empty || findTo.length === 1)))
    {
      return text.replace(re, replaceTo[0] || '');
    }

    const map = {};
    const loopLen = Math.min(repLen, findTo.length);
    for (let i = 0; i < loopLen; ++i)
    {
      map[findTo[i]] = replaceTo[i];
    }

    const cLast = empty ? '' : replaceTo[repLen-1];
    return text.replace(re, (c) => map[c] || cLast);
  });
}

const _tr = tr;

this['tr/I'] = function(findTo, replaceTo, empty)
{
  _tr(findTo, replaceTo, empty, 'ig');
}

const _tri = function(findTo, replaceTo, empty, flag)
{
  if (!findTo)
    return;

  replaceTo = (replaceTo === undefined)
    ? interpretStr(findTo).reverse()
    : replaceTo
    ? interpretStr(replaceTo)
    : '';
  empty = toBoolean(empty);

  selectionOrLineProcess(true, true, function(text) {
    const noFlag = !flag;
    const lowerFlag = (flag === 'l');
    const charSet = noFlag ? findTo
                           : (findTo + (lowerFlag ? findTo.toUpperCase() : findTo.toLowerCase()));
    const re = new RegExp('[' + RegExp.escape(charSet) + ']', noFlag ? 'ig' : 'g');
    const repLen = replaceTo.length;

    if (repLen === 0)
    {
      return text.replace(re, '');
    }

    const map = {};
    const loopLen = empty ? Math.min(repLen, findTo.length) : findTo.length;
    const last = replaceTo[repLen-1];
    for (let i = 0; i < loopLen; ++i)
    {
      const r = replaceTo[i] || last;
      const f = findTo[i];
      const fl = f.toLowerCase();
      const fu = f.toUpperCase();
      if (fl !== fu && (noFlag || (fl === f) === lowerFlag))
      {
        const rl = r.toLowerCase();
        const ru = r.toUpperCase();
        const isLower = (rl === r);
        map[fl] = isLower ? rl : ru;
        map[fu] = isLower ? ru : rl;
      }
      else
      {
        map[f] = r;
      }
    }

    return text.replace(re, (c) => map[c] || '');
  });
}

this['tr/i'] = _tri;

this['tr/l'] = function(findTo, replaceTo, empty)
{
  _tri(findTo, replaceTo, empty, 'l');
}

this['tr/u'] = function(findTo, replaceTo, empty)
{
  _tri(findTo, replaceTo, empty, 'u');
}


function help(cmd)
{
  if (cmd === 'tr')
    return i18n("Translate or delete characters from line or selection.\
<br/><br/>tr(findTo: String, replaceTo: String = '', empty: bool = false)\
<br/>When <i>replaceTo</i> is unspecified, it is initialized with the reverse string of `findTo`. If `findTo` contains only 1 character, `replaceTo` is initialized with an empty string.\
<br/><i>empty</i>: When true, characters in <i>findTo</i> that have no match in <i>replaceTo</i> will be deleted. If false, they will be replaced by the last character of <i>replaceTo</i>.\
<br/><br/>Example with abcd\
<br/>$ tr a\
<br/>> bcd\
<br/>$ tr ab\
<br/>> bacd\
<br/>$ tr ab ''\
<br/>> cd\
<br/>$ tr ab AB\
<br/>> ABcd\
<br/>$ tr ab A\
<br/>> AAcd\
<br/>$ tr ab A 1\
<br/>> Acd");

  if (cmd === 'tr/I')
    return i18n("Case Insensitive version of tr.");

  if (cmd === 'tr/i')
    return i18n("Case Insensitive version of tr. When the replacement is lowercase, the original case is preserved, otherwise the case is reversed.");

  if (cmd === 'tr/l')
    return i18n("Case Insensitive version of tr/i only for lowercase.");

  if (cmd === 'tr/u')
    return i18n("Case Insensitive version of tr/i only for uppercase.");
}
