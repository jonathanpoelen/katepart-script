const katescript = {
  "author": "Jonathan Poelen <jonathan.poelen+katescript@gmail.com>",
  "license": "BSD",
  "revision": 2,
  "kate-version": "5.1",
  "functions": [
    "insert",
    "insertx",
    "inserty",
    "inserty/e",
    "insertLeft",
    "insertxLeft",
    "insertyLeft",
    "insertyLeft/e"
  ]
};

require("range.js")

const _insertImpl = function(n, strings, strNbLines, selection, leftOperation)
{
  let relativePosition = true;
  let insertInEmptyLine = true;
  let nbIgnoredLine = 0;
  let nbInsertedLine = 1;
  let groupStart = 0;
  let endLine = n | 0;

  // n = 0 or formated number
  // e![0-9]+~[0-9]+~[0-9]+~[0-9]+
  // ^ skip empty line
  //  ^ absolutePosition
  //         ^ ignoredLine
  //                ^ insertedLine
  //                       ^ groupStart
  if (!endLine)
  {
    let newStartStr = 0;
    let newEndStr = n.length;

    // search ignoredLine, insertedLine and groupStart options
    let ipos = n.indexOf('~');
    if (ipos !== -1)
    {
      newEndStr = ipos;
      let ipos2 = n.indexOf('~', ipos+1);
      if (ipos2 !== -1)
      {
        let ipos3 = n.indexOf('~', ipos2+1);
        if (ipos3 !== -1)
          groupStart = n.substr(ipos3+1) | 0;
        else
          ipos3 = n.length;
        nbInsertedLine = Math.max(1, n.substring(ipos2+1, ipos3) | 0);
      }
      else
        ipos2 = n.length;
      nbIgnoredLine = Math.max(0, n.substring(ipos+1, ipos2) | 0);

      if (groupStart > 0)
        groupStart = groupStart % (nbIgnoredLine + nbInsertedLine);
      groupStart = nbIgnoredLine + nbInsertedLine - groupStart;
    }

    if (n[0] === 'e')
    {
      insertInEmptyLine = false;
      ++newStartStr;
    }

    if (n[newStartStr] === '!')
    {
      relativePosition = false;
      ++newStartStr;
    }

    endLine = n.substring(newStartStr, newEndStr) | 0;

    if (endLine <= 0)
      return;
  }

  const cursor = view.cursorPosition();
  const column = selection ? selection.start.column : cursor.column;
  const line = selection ? selection.start.line : cursor.line;
  const deltaLeft = leftOperation ? document.lineLength(line) - (selection ? selection.end.column : column) : 0;

  if (relativePosition)
  {
    endLine += line;
    if (!selection)
      endLine += (endLine <= 0 ? 1 : -1);
  }
  else
    --endLine;

  endLine = Math.max(Math.min(endLine, document.lines() - 1), 0);

  let posLine = line;

  document.editBegin();

  const len = strings.length;
  let noInsertionIncrement = 1;

  let insertLine = posLine;

  if (posLine >= endLine)
  {
    [posLine, endLine] = [endLine, posLine];
    for (let i = 0; i < len; ++i)
      strNbLines[i] = -1;
    noInsertionIncrement = -1;
  }

  let iLine = 0;

  // ignore current position when there is a selection
  if (selection)
  {
    insertLine = selection.start.line + strNbLines[0];
    ++posLine;
    ++iLine;
  }

  const nbGroupLine = nbIgnoredLine + nbInsertedLine;

  endLine -= posLine - groupStart;
  posLine = groupStart;
  for (; posLine <= endLine; ++posLine)
  {
    if (posLine % nbGroupLine < nbInsertedLine
     && (insertInEmptyLine || document.firstColumn(insertLine) !== -1))
    {
      const idx = iLine++ % len;
      const insertColumn = leftOperation
        ? Math.max(0, document.lineLength(insertLine) - deltaLeft)
        : column;
      document.insertText(insertLine, insertColumn, strings[idx]);
      insertLine += strNbLines[idx];
    }
    else
      insertLine += noInsertionIncrement;
  }

  if (!selection)
    view.setCursorPosition(cursor);

  document.editEnd();
}


const _insert = function(n, strings, leftOperation)
{
  let selection;
  let strNbLine = 1;
  let str = strings.join(' ');

  // empty str, extract from selection
  if (!str)
  {
    if (!view.hasSelection())
      return;
    selection = view.selection();
    str = view.selectedText();
    strNbLine = selection.end.line - selection.start.line + 1;
  }

  _insertImpl(n, [str], [strNbLine], selection, leftOperation);
}


const _insertx = function(n, strings, leftOperation)
{
  let len = strings.length;
  if (len === 0) return;

  let selection;
  if (view.hasSelection()) {
    selection = view.selection();
    strings.unshift(view.selectedText());
    ++len;
  }

  const strNbLines = Array(len);
  let i = 0;
  for (; i < len; ++i)
    strNbLines[i] = 1;

  if (selection)
    strNbLines[0] += selection.end.line - selection.start.line;

  _insertImpl(n, strings, strNbLines, selection, leftOperation);
}


function insert(n, ...strings) { _insert(n, strings, false); }
function insertx(n, ...strings) { _insertx(n, strings, false); }
function inserty(...strings) { _insertx(strings.length, strings, false); }
this['inserty/e'] = function(...strings) { _insertx(strings.length, strings, false); }
function insertLeft(n, ...strings) { _insert(n, strings, true); }
function insertxLeft(n, ...strings) { _insertx(n, strings, true); }
function insertyLeft(n, ...strings) { _insertx(n, strings, true); }
this['insertyLeft/e'] = function(...strings) { _insertx(strings.length, strings, true); }


function help(cmd)
{
  if (cmd === "insert")
    return i18n("Insert a string on n lines.\
<br/><br/>insert(n: Number|ComplexNumber, ...string: String)\
<br/>n format: 'e'? '!'? [0-9]+ ('~' [0-9]+ ('~' [0-9]+)?)?\
<br/>           ^ do not insert text if empty lines\
<br/>                ^ indicates that position is a line number rather than a relative position\
<br/>                     ^ relative position or line number\
<br/>                                 ^ number of lines skipped after insertion (default=0)\
<br/>                                             ^ number of lines inserted after skip (default=1)\
<br/><br/>Example:\
<br/>> a[0] = ${cursor};\
<br/>> a[1] = ;\
<br/>> a[2] = ;\
<br/>$ insert 3 a + b\
<br/>> a[0] = a + b;\
<br/>> a[1] = a + b;\
<br/>> a[2] = a + b;");

  if (cmd === "insertx")
    return i18n("Insert strings on n lines.\
<br/><br/>insert(n: Number|ComplexNumber, ...string: String)\
<br/>n format: 'e'? '!'? [0-9]+ ('~' [0-9]+ ('~' [0-9]+ ('~' [0-9]+)?)?)?\
<br/>           ^ do not insert text if empty lines\
<br/>                ^ indicates that position is a line number rather than a relative position\
<br/>                     ^ relative position or line number\
<br/>                                 ^ number of lines skipped after insertion (default=0)\
<br/>                                             ^ number of lines inserted after skip (default=1)\
<br/>                                                         ^ shifts inserts, can be negative\
<br/><br/>Example:\
<br/>> a[0] = ${cursor};\
<br/>> a[1] = ;\
<br/>> a[2] = ;\
<br/>$ insertx 3 a b\
<br/>> a[0] = a;\
<br/>> a[1] = b;\
<br/>> a[2] = a;");

  if (cmd === "inserty")
    return i18n("Insert n lines.\
<br/><br/>inserty(...string: String)\
<br/><br/>Example:\
<br/>> a[0] = ${cursor};\
<br/>> a[1] = ;\
<br/>$ inserty a b\
<br/>> a[0] = a;\
<br/>> a[1] = b;");

  if (cmd === "inserty/e")
    return i18n("inserty which ignores empty lines.");

  if (cmd === "insertLeft")
    return i18n("Same as insert, but the number of characters to the right of the inserted text remains the same.\
<br/><br/>Example:\
<br/>> a[0] = ${cursor};\
<br/>> a[11] = ;\
<br/>> a[222] = ;\
<br/>$ insertLeft 3 a + b\
<br/>> a[0] = a + b;\
<br/>> a[11] = a + b;\
<br/>> a[222] = a + b;");

  if (cmd === "insertxLeft")
    return i18n("Same as insertx, but the number of characters to the right of the inserted text remains the same.\
<br/><br/>Example:\
<br/>> a[0] = ${cursor};\
<br/>> a[11] = ;\
<br/>> a[222] = ;\
<br/>$ insertxLeft 3 a b\
<br/>> a[0] = a;\
<br/>> a[11] = b;\
<br/>> a[222] = a;");

  if (cmd === "insertyLeft")
    return i18n("Same as inserty, but the number of characters to the right of the inserted text remains the same.\
<br/><br/>Example:\
<br/>> a[0] = ${cursor};\
<br/>> a[11] = ;\
<br/>$ insertyLeft a b\
<br/>> a[0] = a;\
<br/>> a[11] = b;");

  if (cmd === "insertyLeft/e")
    return i18n("Same as inserty/e, but the number of characters to the right of the inserted text remains the same.");
}
