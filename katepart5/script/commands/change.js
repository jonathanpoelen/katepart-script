const katescript = {
  "author": "Jonathan Poelen <jonathan.poelen+katescript@gmail.com>",
  "license": "BSD",
  "revision": 2,
  "kate-version": "5.1",
  "functions": [
    "change",
    "change/r",
    "change/ri",
    "changex",
    "changex/r",
    "changex/ri",
    "changey",
    "changey/r",
    "changey/ri"
  ]
};

require("jln/selectionOrLineProcess.js")
require("jln/regex-utils.js")


const _change = function(args, gpatt, fpatt, dpatt, npatt, relativeRepl, drepl, nrepl)
{
  selectionOrLineProcess(true, true, function(text, cursor) {
    const column = cursor ? cursor.column : 0;
    const parts = [];
    const textLen = text.length;
    let i = 0;
    let pos = 0;
    let columnDelta = 0;
    for (;; ++i)
    {
      const ipatt = (i / gpatt | 0) % npatt * fpatt;
      const pattern = args[ipatt + dpatt];
      let pos2 = text.indexOf(pattern, pos);
      // pos2 === textLen when pattern.length === 0 and pos === text.length
      if (-1 === pos2 || pos2 === textLen) {
        if (cursor) {
          cursor.column += columnDelta;
        }
        parts.push(text.substr(pos));
        return parts.join('');
      }

      const irepl = ipatt * relativeRepl + i % nrepl;
      const replacement = args[irepl + drepl] || '';
      if (pattern.length !== 0) {
        parts.push(text.substring(pos, pos2), replacement);
      }
      else {
        ++pos2;
        parts.push(replacement, text.substring(pos, pos2));
      }

      if (pos2 + pattern.length <= column) {
        columnDelta += replacement.length - pattern.length;
      }
      else if (pos2 < column) {
        columnDelta += replacement.length - Math.min(column - pos2, replacement.length);
      }

      pos = pos2 + pattern.length;
    }
  });
};

function change(pattern/*, replacement...*/)
{
  const nrepl = arguments.length - 1;
  if (nrepl <= 0) return;

  _change(arguments, 1, 1, 0, 1, 0, 1, nrepl);
}

const _changeR = function(args, gpatt, fpatt, dpatt, npatt, relativeRepl, drepl, nrepl)
{
  selectionOrLineProcess(true, true, function(text, cursor) {
    const column = cursor ? cursor.column : 0;
    const parts = [];
    let i = 0;
    let pos = 0;
    let columnDelta = 0;
    for (;; ++i)
    {
      const ipatt = (i / gpatt | 0) % npatt * fpatt;
      const pattern = args[ipatt + dpatt];
      pattern.lastIndex = pos;
      const m = pattern.exec(text);
      if (!m) {
        if (cursor) {
          cursor.column += columnDelta;
        }
        parts.push(text.substr(pos));
        return parts.join('');
      }

      let pos2 = m.index;
      const irepl = ipatt * relativeRepl + i % nrepl;
      const replacement = args[irepl + drepl] || '';
      const pattLen = pattern.lastIndex - pos2;
      if (pos !== pos2 || pattLen !== 0) {
        parts.push(text.substring(pos, pos2), replacement);
      }
      else {
        ++pos2;
        parts.push(replacement, text.substring(pos, pos2));
      }

      if (pos2 + pattLen <= column) {
        columnDelta += replacement.length - pattLen;
      }
      else if (pos2 < column) {
        columnDelta += replacement.length - Math.min(column - pos2, replacement.length);
      }

      pos = pattern.lastIndex + (pattern.lastIndex === pos);
    }
  });
};

const _changeRf = function(args, patternFlags)
{
  const nrepl = args.length - 1;
  if (nrepl <= 0) return;

  args[0] = RegExp(args[0], patternFlags);
  _changeR(args, 1, 1, 0, 1, 0, 1, nrepl);
}

this['change/r'] = function(/*pattern, replacement...*/)
{
  _changeRf(arguments, 'g');
}

this['change/ri'] = function(/*pattern, replacement...*/)
{
  _changeRf(arguments, 'gi');
}


function changex(npatt, /*patt0, ..., pattN, replacement0, ..., replacementN*/)
{
  npatt = npatt | 0;
  if (npatt <= 0) return;

  const nrepl = arguments.length - npatt - 1;
  _change(arguments, 1, 1, 1, npatt, 0, npatt + 1, nrepl);
}

const _changexR = function(args, patternFlags)
{
  const npatt = args[0] | 0;
  if (npatt <= 0) return;

  for (let i = 0; i < npatt; ++i) {
    args[i + 1] = RegExp(args[i + 1], patternFlags);
  }

  const nrepl = args.length - npatt - 1;
  _changeR(args, 1, 1, 1, npatt, 0, npatt + 1, nrepl);
}

this['changex/r'] = function(/*npatt, patt0, ..., pattN, replacement0, ..., replacementN*/)
{
  _changexR(arguments, 'g');
}

this['changex/ri'] = function(/*npatt, patt0, ..., pattN, replacement0, ..., replacementN*/)
{
  _changexR(arguments, 'gi');
}


function changey(nrepl, /*patt0, replacement0 ... replacementN, ... pattN, replacement0 ... replacementN*/)
{
  nrepl = nrepl | 0;
  if (nrepl <= 0) return;

  const ngroup = nrepl + 1;
  const npatt = (arguments.length + nrepl - 1) / ngroup | 0;
  if (npatt <= 0) return;

  _change(arguments, nrepl, ngroup, 1, npatt, 1, 2, nrepl);
}

const _changeyR = function(args, patternFlags)
{
  const nrepl = args[0] | 0;
  if (nrepl <= 0) return;

  const ngroup = nrepl + 1;
  const npatt = (args.length + ngroup - 2) / ngroup | 0;
  for (let i = 0; i < npatt; ++i) {
    args[i * ngroup + 1] = RegExp(args[i * ngroup + 1], patternFlags);
  }

  _changeR(args, nrepl, ngroup, 1, npatt, 1, 2, nrepl);
}

this['changey/r'] = function(/*nrepl, patt0, replacement0 ... replacementN, ... pattN, replacement0 ... replacementN*/)
{
  _changeyR(arguments, 'g')
}

this['changey/ri'] = function(/*nrepl, patt0, replacement0 ... replacementN, ... pattN, replacement0 ... replacementN*/)
{
  _changeyR(arguments, 'gi')
}


function help(cmd)
{
  if (cmd === "change")
    return i18n("Replace a pattern with new strings. The replaced string changes with each iteration. Applies to a selection or a line.\
<br/><br/>change(pattern: String, ...remplacement: String)\
<br/><br/>Example:\
<br/>> a[i] = i; b[i] = i; c[i] = i;\
<br/>$ change i 0 1\
<br/>> a[0] = 1; b[0] = 1; c[0] = 1;");

  if (cmd === "change/r")
    return i18n("Same as change, but pattern is a RegExp.\
<br/><br/>change/r(pattern: String, ...remplacement: String)");

  if (cmd === "change/ri")
    return i18n("Same as change, but pattern is a insensitive RegExp.\
<br/><br/>change/ri(pattern: String, ...remplacement: String)");

  if (cmd === "changex")
    return i18n("Replaces a pattern with a new string. Pattern and string change with each iteration. Applies to a selection or a line.\
<br/><br/>changex(nbPattern: int, ...pattern: String, ...replacement: String)\
<br/><br/>Example:\
<br/>> a[i] = x; b[i] = x; c[i] = x;\
<br/>$ changex 2 i x 0 1\
<br/>> a[0] = 1; b[0] = 1; c[0] = 1;\
<br/>\
<br/>> a[i] = x; b[i] = x; c[i] = x;\
<br/>$ changex 2 i x 0 1 2\
<br/>> a[0] = 1; b[2] = 0; c[1] = 2;");

  if (cmd === "changex/r")
    return i18n("Same as changex, but pattern is a RegExp.\
<br/><br/>changex/r(nbPattern: int, ...pattern: String, ...replacement: String)");

  if (cmd === "changex/ri")
    return i18n("Same as changex, but pattern is a insensitive RegExp.\
<br/><br/>changex/ri(nbPattern: int, ...pattern: String, ...replacement: String)");

  if (cmd === "changey")
    return i18n("Replaces a pattern with a new string. Pattern change with each iteration and replacement changes after each replacement group. Applies to a selection or a line.\
<br/><br/>changey(nbReplacement: int, pattern0: String, ...replacement0: String, pattern1: String, ...replacement1: String, ...)\
<br/><br/>Example:\
<br/>> a[i] = x; b[i] = x; c[i] = x;\
<br/>$ changey 1 i 0 x 1\
<br/>> a[0] = 1; b[0] = 1; c[0] = 1;");

  if (cmd === "changey/r")
    return i18n("Same as changey, but pattern is a RegExp.\
<br/><br/>changey/r(nbPattern: int, ...pattern: String, ...replacement: String)");

  if (cmd === "changey/ri")
    return i18n("Same as changey, but pattern is a insensitive RegExp.\
<br/><br/>changey/ri(nbPattern: int, ...pattern: String, ...replacement: String)");
}
