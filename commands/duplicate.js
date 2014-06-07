/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: duplicate
 */

require("string-utils.js")
require("toBoolean.js")
require("selectionOrLine.js")
require("range.js")
require("stepper.js")

function duplicate(n, down)
{
  var cursorPosition = view.cursorPosition(),
    selection = selectionOrLine(true);
  down = toBoolean(down);

  if (!n || !isNaN(+n))
  {
    n = +n;
    document.insertText(selection.range.start, selection.text.repeat(Math.abs(n)||1));
    if (!(n < 0 || down))
    {
      if (view.hasSelection())
        view.setSelection(selection.range);
      view.setCursorPosition(cursorPosition);
    }
  }
  else
  {
    var cursor = selection.range.start,
      newline = selection.text.countLine(),
      stepper = Stepper(n, cursor.line),
      line = -1;
    if (stepper.isNegative())
      down = true;
    document.editBegin();
    while (stepper.valid())
    {
      ++line;
      if (stepper.onStep(line))
      {
        cursor.line += newline;
        line += newline - 1;
        document.insertText(cursor, selection.text);
        stepper.next();
      }
      else
        cursor.line += 1;
    }
    document.editEnd();

    if (down)
    {
      if (view.hasSelection())
      {
        selection.range.start.line = cursor.line;
        selection.range.end.line = cursor.line + newline - 1;
        view.setSelection(selection.range);
      }
      cursor.column = cursorPosition.column;
      view.setCursorPosition(cursor);
    }
  }
}

function action(cmd)
{
  if ("duplicate" === cmd)
    return {
      icon: "",
      category: "",
      interactive: false,
      text: i18n("Duplicate the selected text or line"),
      shortcut: "Ctrl+Alt+D"
    };
}

function help(cmd)
{
  if (cmd === "duplicate")
    return i18n("Duplique la ligne ou la sélection n fois.\
<br/><br/>duplicate(n: Number|Stepper= 1, down: Boolean= false)\
<br/>down: Si ou que n est un nombre négatif, vrai déplace le curseur au niveau du dernier élement dupliqué.\
<br/><br/>exemple:\
<br/>$ duplicate ~2:5\
<br/>duplique 5 fois la ligne une ligne sur 2");
}
