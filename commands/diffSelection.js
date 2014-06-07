/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: diffSelection
 */

require("cursor-command.js")
require("range.js")

function diffSelection(c1, c2, c3, c4)
{
  var selection;
  if (view.hasSelection())
  {
    selection = view.selection();
    cursor(c1, c2);
  }
  else
  {
    var position = view.cursorPosition();
    cursor(c1, c2);
    selection = view.selection();
    view.setCursorPosition(position);
    cursor(c3, c4);
  }
  var selection2 = view.selection();
  view.setSelection(new Range(
    (selection.start.compareTo(selection2.start) === -1 ? selection2 : selection).start,
    (selection.end.compareTo(selection2.end) === 1 ? selection2 : selection).end
  ));
}

function help(cmd)
{
  if (cmd === "diffSelection")
    return i18n("Sélectionne la différence de la sélection. Si une sélection existe, la différence se fera avec cursor(c1, c2)\
<br/><br/>diffSelection(c1: cursor, c2: cursor, c3: cursor, c4: cursor)");
}
