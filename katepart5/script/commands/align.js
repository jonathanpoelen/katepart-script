const katescript = {
  "author": "Jonathan Poelen <jonathan.poelen+katescript@gmail.com>",
  "license": "BSD",
  "revision": 2,
  "kate-version": "5.1",
  "functions": [ "align", "align/a" ]
};

require("jln/toBoolean.js")
require("range.js")

this['align/a'] = function(pattern, paddingChar, limit) {
  align(pattern, paddingChar, true, limit);
}

function align(pattern, paddingChar, insertAfter, limit)
{
  const hasSelection = view.hasSelection();
  const selection = hasSelection ? view.selection() : document.documentRange();

  if (selection.end.line - selection.start.line < 1) {
    return;
  }

  paddingChar = paddingChar ? paddingChar[0] : ' ';
  insertAfter = toBoolean(insertAfter);
  limit = parseInt(limit) || 0xffff;

  const blockSelection = view.blockSelection();
  const selectionStartColumn = selection.start.column;
  const startColumn = blockSelection ? selectionStartColumn : 0;

  // QJSEngine doesn't support d flag: https://bugreports.qt.io/browse/QTBUG-111738
  // const re = pattern
  //   ? new RegExp(pattern, pattern.indexOf('(') === -1 ? 'g' : 'dg')
  //   : /[^\s]+/g;
  const hasIndices = pattern ? pattern.indexOf('(') === -1 : false;
  const re = pattern ? new RegExp(pattern, 'g') : /[^\s]+/g;
  const lines = document.text(selection).split('\n');
  const nbLine = lines.length;
  const patternStartColumns = new Array(nbLine);
  let nbMaxColumn = 0;

  /**
   * extract all positions of the pattern for each line
   */
  for (let i = 0; i < nbLine; ++i)
  {
    const line = lines[i];
    re.lastIndex = 0;
    let match = re.exec(line);
    if (match)
    {
      const columns = [];
      let icolumn = 0;
      do {
        // QJSEngine doesn't support match.indices: https://bugreports.qt.io/browse/QTBUG-111738
        // const column = match[1]
        //   ? (insertAfter ? match.indices[1][1] : match.indices[1][0])
        //   : (insertAfter ? match.index + match[0].length : match.index);
        const column = match[1]
          ? line.indexOf(match[1], match.index) + (insertAfter ? match[1].length : 0)
          : (insertAfter ? match.index + match[0].length : match.index);
        columns.push(startColumn + column);
      } while (++icolumn < limit && (match = re.exec(line)));
      patternStartColumns[i] = columns;
      nbMaxColumn = Math.max(nbMaxColumn, icolumn);
    }
  }

  if (nbMaxColumn === 0)
    return;

  // normal selection that does not start at the beginning of the line
  if (!blockSelection && selectionStartColumn && patternStartColumns[0])
  {
    const columns = patternStartColumns[0];
    for (let i = 0; i < columns.length; ++i)
    {
      columns[i] += selectionStartColumn;
    }
  }

  const nbCharInserted = new Array(nbLine);
  for (let i = 0; i < nbLine; ++i)
  {
    nbCharInserted[i] = 0;
  }

  const startLine = selection.start.line;

  document.editBegin();
  for (let icolumn = 0; icolumn < nbMaxColumn; ++icolumn)
  {
    let maxColumn = 0;
    // maximum column search
    for (let i = 0; i < nbLine; ++i)
    {
      const columns = patternStartColumns[i];
      if (columns && columns[icolumn] !== undefined)
      {
        maxColumn = Math.max(nbCharInserted[i] + columns[icolumn], maxColumn);
      }
    }

    // insert text
    for (let i = 0; i < nbLine; ++i)
    {
      const columns = patternStartColumns[i];
      if (columns && columns[icolumn] !== undefined)
      {
        const column = nbCharInserted[i] + columns[icolumn];
        if (maxColumn !== column)
        {
          const inserted = maxColumn - column;
          document.insertText(startLine + i, column, paddingChar.repeat(inserted));
          nbCharInserted[i] += inserted;
        }
      }
    }
  }
  document.editEnd();
}

function help(cmd)
{
  if (cmd === "align")
    return i18n("Aligns lines in range on the columns given by the regular expression pattern. If the pattern has a capture it will indent on the captured match.\
<br/><br/>align(pattern: RegExp = '[^\\s]+', paddingChar: Char = ' ', insertAfter: bool = false, limit = 0)");

  if (cmd === "align/a")
    return i18n("As align, but insertAfter is 1.\
<br/><br/>align/a(pattern: RegExp = '[^\\s]+', paddingChar: Char = ' ', limit = 0)");
}
