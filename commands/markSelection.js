/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: markSelection
 */

require ("range.js");

var mark_on_selection = null;

function markSelection() {
  var cursor = view.cursorPosition();
  if (mark_on_selection) {
    view.setSelection(new Range(cursor, mark_on_selection));
    mark_on_selection = null;
  }
  else {
    mark_on_selection = cursor;
  }
}

function help(cmd) {
  if (cmd === 'markSelection') {
    return i18n("Saves the cursor position. The second call makes a selection");
  }
}

function action(cmd)
{
  if ('markSelection' === cmd)
    return {
      icon: "",
      category: "Selection",
      interactive: false,
      text: i18n("Saves the cursor position. The second call makes a selection"),
      shortcut: "Ctrl+3"
    };
}
