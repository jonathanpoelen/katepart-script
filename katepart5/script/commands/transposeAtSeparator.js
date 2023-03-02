const katescript = {
  "author": "Jonathan Poelen <jonathan.poelen+katescript@gmail.com>",
  "license": "BSD",
  "revision": 2,
  "kate-version": "5.1",
  "functions": [ "transposeAtSeparator"
               , "transposeAtRegexSeparator"
               , "transposeAtSeparator/s"
               , "transposeAtRegexSeparator/s"
               , "transposeAtSeparator/sb"
               , "transposeAtSeparator/bs"
               , "transposeAtRegexSeparator/sb"
               , "transposeAtRegexSeparator/bs"
               ],
  "actions": [
    { "function": "transposeAtSeparator/s"
    , "name": "Transpose At Separator"
    , "category": "Editing"
    , "interactive": true
    },
    { "function": "transposeAtRegexSeparator/s"
    , "name": "Transpose At Regex Separator"
    , "category": "Editing"
    , "interactive": true
    }
  ]
};

require("range.js")
require("jln/interpretStr.js")
require("jln/toBoolean.js")
require("jln/regex-utils.js")
require("jln/string-utils.js")
require("jln/bracketMap.js")


function transposeAtSeparator(delimiter, ignoreSpaces, idx)
{
  _transposeAtSeparator(delimiter, false, ignoreSpaces, idx)
}

function transposeAtRegexSeparator(delimiter, ignoreSpaces, idx)
{
  _transposeAtSeparator(delimiter, true, ignoreSpaces, idx)
}

const _transposeAtSeparator = function(delimiter, delimiterAsRegex, ignoreSpaces, idx)
{
  if (!delimiter) return;

  const cursor = view.cursorPosition();
  const line = cursor.line;
  const lineLength = document.lineLength(line);
  const hasSelection = view.hasSelection();
  const range = hasSelection ? view.selection() : new Range(line, 0, line, lineLength);

  ignoreSpaces = ignoreSpaces ? toBoolean(ignoreSpaces) : true;

  if (!hasSelection && ignoreSpaces && _skipSpacesInRange(range, line))
  {
    return;
  }

  const text = (hasSelection || ignoreSpaces) ? document.text(range) : document.line(line);

  idx = parseInt(idx) || 0;

  if (delimiterAsRegex)
  {
    const re = new RegExp(delimiter, 'g');

    if (idx >= 0)
    {
      let startDelim;
      let delimLen;

      do {
        const m = re.exec(text);
        if (!m) return;
        startDelim = m.index
        delimLen = m[0].length;
      } while (0 !== idx--);

      _transposeRange(text, ignoreSpaces, range, startDelim, startDelim + delimLen, 0);
    }
    else
    {
      const mod = -idx;
      const startDelims = new Array(mod);
      let i = 0;
      let m;

      while (m = re.exec(text)) {
        startDelims[i++ % mod] = [m.index, m[0].length];
      }

      if (i < mod) return;
      let r = startDelims[i % mod];
      _transposeRange(text, ignoreSpaces, range, r[0], r[0] + r[1], 0);
    }
  }
  else
  {
    delimiter = interpretStr(delimiter);
    const delimLen = delimiter.length;

    let startDelim = -delimLen;
    if (idx >= 0)
    {
      // search separator (forwarding)
      do {
        startDelim = text.indexOf(delimiter, startDelim + delimLen);
        if (-1 === startDelim) return;
      } while (0 !== idx--);
    }
    else
    {
      startDelim = text.length;
      // search separator (backward)
      do {
        startDelim = text.lastIndexOf(delimiter, startDelim - 1);
        if (-1 === startDelim) return;
      } while (0 !== ++idx);
    }

    _transposeRange(text, ignoreSpaces, range, startDelim, startDelim + delimLen, 0);
  }
}

const _skipSpacesInRange = function(range, line)
{
  range.start.column = document.nextNonSpaceColumn(line, range.start.column);
  range.end.column = document.prevNonSpaceColumn(line, range.end.column) + 1;
  return range.start.equals(range.end);
}

const _skipOffsetLeftSpaces = function(text, start, end)
{
  while (start < end && isBlank(text[start])) ++start;
  return start;
}

const _skipOffsetRightSpaces = function(text, start, end)
{
  while (start > end && isBlank(text[start-1])) --start;
  return start;
}

const _transposeRange = function(text, ignoreSpaces, range, startDelim, endDelim, startText, endText)
{
  if (ignoreSpaces)
  {
    const end = (endText === undefined) ? text.length : endText;
    endDelim = _skipOffsetLeftSpaces(text, endDelim, end);
    startDelim = _skipOffsetRightSpaces(text, startDelim, startText);
  }

  const left = text.substring(startText, startDelim);
  const middle = text.substring(startDelim, endDelim);
  const right = text.substring(endDelim, endText);

  document.editBegin();
  document.removeText(range);
  document.insertText(range.start, right+middle+left);
  document.editEnd();
}

this['transposeAtSeparator/s'] = function(delimiter, extraEnclosing, ignoreSpaces, enclosing, barrierDelimiter)
{
  _smartTransposeAt(delimiter, false, extraEnclosing, ignoreSpaces, enclosing, barrierDelimiter)
}

this['transposeAtRegexSeparator/s'] = function(delimiter, extraEnclosing, ignoreSpaces, enclosing, barrierDelimiter)
{
  _smartTransposeAt(delimiter, true, extraEnclosing, ignoreSpaces, enclosing, barrierDelimiter)
}

this['transposeAtSeparator/sb'] =
this['transposeAtSeparator/sb'] = function(delimiter, barrierDelimiter, extraEnclosing, ignoreSpaces, enclosing)
{
  _smartTransposeAt(delimiter, false, extraEnclosing, ignoreSpaces, enclosing, barrierDelimiter)
}

this['transposeAtRegexSeparator/sb'] =
this['transposeAtRegexSeparator/sb'] = function(delimiter, barrierDelimiter, extraEnclosing, ignoreSpaces, enclosing)
{
  _smartTransposeAt(delimiter, true, extraEnclosing, ignoreSpaces, enclosing, barrierDelimiter)
}

const _smartTransposeAt = function(
  delimiter, delimiterAsRegex, extraEnclosing, ignoreSpaces, enclosing, barrierDelimiter)
{
  ignoreSpaces = ignoreSpaces ? toBoolean(ignoreSpaces) : true;
  enclosing = enclosing || BracketMap.defaultEnclosing1;
  if (extraEnclosing)
  {
    enclosing += interpretStr(extraEnclosing);
  }

  const cursor = view.cursorPosition();
  const hasSelection = view.hasSelection();
  const bracketMap = BracketMap.makeBracketMap(enclosing);
  const escapedEnclosing = RegExp.escape(enclosing);
  const enclosingPattern = '([' + escapedEnclosing + '])|';

  let findTextPatternPrefix = enclosingPattern;
  let startDelim = -1;
  let range, text;

  if (hasSelection)
  {
    range = view.selection();
    text = view.selectedText();

    // find the position of the delimiter
    const delimPattern = delimiter
      ? enclosingPattern + (delimiterAsRegex ? delimiter : RegExp.escape(delimiter))
      : '([' + escapedEnclosing + '])|[^\\w\\s' + escapedEnclosing + ']+';
    const regexDelimiter = new RegExp(delimPattern, 'g');
    const result = _findBestDelimiter(regexDelimiter, text, bracketMap);
    if (!result) return;

    startDelim = result[0];
    delimiter = delimiter || text.substring(startDelim, result[1]);
  }
  else
  {
    const line = cursor.line;
    const lineLength = document.lineLength(line);
    range = new Range(line, 0, line, lineLength);

    if (ignoreSpaces && _skipSpacesInRange(range, line))
    {
      return;
    }

    text = ignoreSpaces ? document.text(range) : document.line(line);
    const column = cursor.column - range.start.column;

    if (delimiterAsRegex && delimiter)
    {
      const regex = new RegExp(delimiter, 'g');
      regex.lastIndex = column;
      let m = regex.exec(text);
      if (!m || m.index !== column)
      {
        regex.lastIndex = 0;
        let mm
        while ((mm = regex.exec(text)) && mm.index < column)
        {
          m = mm;
        }
        m = m || mm;
        if (!m) return;
        startDelim = m.index;
        delimiter = m[0];
      }
    }
    else if (delimiter)
    {
      delimiter = interpretStr(delimiter);
      const delimLen = delimiter.length;
      // delimiter = "###"
      //            /¯¯¯¯¯\ delimiter search area (frag)
      // bla bla bla ##|## bla bla bla
      //             ^ first occurrence
      //              ^ start delimiter (closer to cursor)
      //               ^ cursor position
      // \___________/ reversed text
      const frag = text.substring(column - delimLen, column + delimLen);
      let pos = frag.indexOf(delimiter);
      if (pos === -1)
      {
        startDelim = text.indexOf(delimiter);
        if (startDelim === -1) return;
      }
      else
      {
        do {
          startDelim = pos + column - delimLen;
          if (pos >= delimLen) break;
          pos = frag.indexOf(delimiter, pos + 1);
        } while (pos !== -1 && pos <= delimLen);
      }
    }
    else
    {
      // extract symbol under cursor position
      const regex = /\s*([^\w\s]+)|/g;
      regex.lastIndex = column;
      const m = regex.exec(text);
      if (m && m[0] && m.index === column)
      {
        delimiter = m[0];
        startDelim = column;
      }
      // search backward
      else
      {
        const reversedText = text.substring(column - 10, column).reverse();
        regex.lastIndex = 0;
        const m = regex.exec(reversedText);
        if (!m || !m[0] || m.index !== 0)
        {
          return;
        }
        delimiter = m[0].reverse();
        startDelim = column - delimiter.length;
      }
    }

    if (barrierDelimiter)
    {
      findTextPatternPrefix += '([' + RegExp.escape(barrierDelimiter) + '])|';
    }
  }

  // find start of text from cursor position
  const reverseDelimiter = delimiter.reverse();
  const reversedText = text.reverse(startDelim);
  const reversedRegex = new RegExp(findTextPatternPrefix + RegExp.escape(reverseDelimiter), 'g');
  let startText = reversedText.length - _findColumnDelimiter(reversedRegex, reversedText, bracketMap, 1);

  // find end of text from cursor position
  const regex = new RegExp(findTextPatternPrefix + RegExp.escape(delimiter), 'g');
  const endDelim = startDelim + delimiter.length;
  regex.lastIndex = endDelim;
  let endText = _findColumnDelimiter(regex, text, bracketMap, -1);

  if (ignoreSpaces)
  {
    startText = _skipOffsetLeftSpaces(text, startText, startDelim);
    endText = _skipOffsetRightSpaces(text, endText, endDelim);
  }

  // adapt range to found text (startText / endText)
  if (!hasSelection || range.onSingleLine())
  {
    range.start.column += startText;
    range.end.column -= text.length - endText;
  }
  else
  {
    _advanceCursorToEnd(range.start, text, 0, startText);
    range.end.line = range.start.line;
    range.end.column = range.start.column;
    _advanceCursorToEnd(range.end, text, startText, endText);
  }

  _transposeRange(text, ignoreSpaces, range, startDelim, endDelim, startText, endText);
}

const _advanceCursorToEnd = function(cursor, text, skipIndex, end)
{
  let newLinePos = text.indexOf('\n', skipIndex);
  if (newLinePos === -1)
  {
    cursor.column += text.length - skipIndex;
    return;
  }

  if (newLinePos >= end)
  {
    cursor.column += end - skipIndex;
    return;
  }

  ++cursor.line;

  let pos;
  while (-1 !== (pos = text.indexOf('\n', newLinePos+1)) && pos <= end)
  {
    newLinePos = pos;
    ++cursor.line;
  }

  cursor.column = end - newLinePos - 1;
  return cursor;
}

const _findBestDelimiter = function(regex, text, bracketMap)
{
  let bracketLevels = [0, 0, 0, 0];
  let enclosingTriggered = {};
  let enclosingTriggeredCounter = 0;
  let level = 0;
  let result;
  let matchResult;

  while (matchResult = regex.exec(text)) {
    // brackets
    if (matchResult[1]) {
      const c = matchResult[1];
      const m = bracketMap[c];
      if (m) {
        level += m[1];
        bracketLevels[m[0]] += m[1];
        if (bracketLevels[m[0]] === -1) {
          return result;
        }
      }
      else {
        enclosingTriggered[c] = !enclosingTriggered[c];
        const inc = enclosingTriggered[c] * 2 - 1;
        enclosingTriggeredCounter += inc;
        level += inc;
      }
    }
    // delimiters (best case is preceded with space)
    else {
      const pos = matchResult.index;
      if (!result
       || (text[result[0]] !== ' '
        && (result[2] > level || (result[2] === level && text[pos-1] === ' ')))
      ) {
        result = [pos, regex.lastIndex, level];
      }

      if (level == 0 && text[result[0]] === ' ') {
        return result;
      }
    }
  }

  return result;
}

const _findColumnDelimiter = function(regex, text, bracketMap, factor)
{
  let bracketLevels = [0, 0, 0, 0];
  let enclosingTriggered = {};
  let enclosingTriggeredCounter = 0;
  let level = 0;
  let firstEnclosingTriggered = -1;
  let matchResult;

  while (matchResult = regex.exec(text)) {
    // brackets
    if (matchResult[1]) {
      const c = matchResult[1];
      const m = bracketMap[c];
      if (m) {
        level += m[1];
        bracketLevels[m[0]] += m[1] * factor;
        if (bracketLevels[m[0]] === 1) {
          return matchResult.index;
        }
      }
      else {
        debug(c)
        enclosingTriggered[c] = !enclosingTriggered[c];
        const inc = enclosingTriggered[c] * 2 - 1;
        enclosingTriggeredCounter += inc;
        level += inc;
        firstEnclosingTriggered = level ? matchResult.index : -1;
      }
    }
    // barrier delimiters
    else if (matchResult[2]) {
      return matchResult.index;
    }
    // delimiters
    else if (!level) {
      return matchResult.index;
    }
  }

  return firstEnclosingTriggered === - 1 ? text.length : firstEnclosingTriggered;
}


function help(cmd)
{
  if (cmd === "transposeAtSeparator/s")
    return i18n("Transpose the strings left and right from the delimiter under current cursor position\
 and move the cursor one position to the right.\
<br/>The borders of the transposition stop at the next delimiter found or\
 at the next opening bracket for the left, closing for the right.\
<br/><br/>transposeAtSeparator/s(delimiter: String = '', ignoreSpaces: bool = true, extraEnclosing: String = '', enclosing: String = '([{}])', barrierDelimiter: String = '')\
<br/>When `delimiter` is empty, the symbols under the cursor are considered to be the delimiter.\
<br/>Ignore delimiter between (), [], {} and <> pairs or between 2 characters.\
<br/>When characters in `barrierDelimiter` are found, the search stops even if it is inside brackets.");

  if (cmd === "transposeAtSeparator/sb" || cmd === "transposeAtSeparator/bs")
    return i18n("Same as transposeAtSeparator/s, but `barrierDelimiter` is in second parameter.");

  if (cmd === "transposeAtRegexSeparator/s")
    return i18n("Same as transposeAtSeparator/s, but `delimiter` is a regular expression.");

  if (cmd === "transposeAtRegexSeparator/sb" || cmd === "transposeAtRegexSeparator/bs")
    return i18n("Same as transposeAtRegexSeparator/s, but `barrierDelimiter` is in second parameter.");

  if (cmd === "transposeAtSeparator")
    return i18n("Transpose the strings left and right to delimiter\
 and move the cursor one position to the right.\
<br/><br/>transposeAtSeparator(delimiter: String, ignoreSpaces: bool = true, delimIdx: int = 0)\
<br/>`delimIdx` is the index of the delimiter to be used among all those found.");

  if (cmd === "transposeAtRegexSeparator")
    return i18n("Same as transposeAtSeparator, but `delimiter` is a regular expression.");
}
