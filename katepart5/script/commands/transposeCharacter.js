const katescript = {
  "author": "Jonathan Poelen <jonathan.poelen+katescript@gmail.com>",
  "license": "BSD",
  "revision": 2,
  "kate-version": "5.1",
  "functions": [ "transposeCharacter"
               , "transposePreviousCharacter"
               ],
  "actions": [
    { "function": "transposeCharacter"
    , "name": "Advanced Transpose Characters"
    , "category": "Editing"
    , "shortcut": "Ctrl+Alt+T"
    },
    { "function": "transposePreviousCharacter"
    , "name": "Advanced Transpose Previous Characters"
    , "category": "Editing"
    , "shortcut": "Shift+Ctrl+Alt+T"
    }
  ]
};

require("cursor.js")


function transposeCharacter(deltaColumn)
{
  _transposeCharacterAt(view.cursorPosition(), deltaColumn);
}

function transposePreviousCharacter()
{
  _transposeCharacterAt(view.cursorPosition(), -1);
}

const _transposeCharacterAt = function(cursor, deltaColumn)
{
  const line = cursor.line;
  const lineLength = document.lineLength(line);

  if (lineLength < 2) return;

  let column = cursor.column + (+deltaColumn || 0);
  column = Math.max(1, Math.min(column, lineLength-1));

  const start = {line: line, column: column - 1};
  const range = {start: start, end: {line: line, column: column + 1}};
  const str = document.text(range);

  document.editBegin();
  document.removeText(range);
  document.insertText(start, str[1] + str[0]);
  document.editEnd();
}


function help(cmd)
{
  if (cmd === "transposeCharacter")
    return i18n("Transpose the characters left and right from the current cursor position\
 and move the cursor one position to the right.\
<br/>If the cursor is at the end of the line, transpose the 2 previous characters.\
<br/>If the cursor is at the beginning of the line, transpose the 2 next characters.\
<br/><br/>transposeCharacter(deltaColumn: int = 0)");

  if (cmd === "transposePreviousCharacter")
    return i18n("Move the cursor to the left then perform <i>transposeCharacter</i>.");
}
