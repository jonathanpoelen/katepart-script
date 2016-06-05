/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: markSelection, markJump, markClean
 */

require ("range.js");

var mark_on_selection = null;

function markSelection() {
  var cursor = view.cursorPosition();
  if (mark_on_selection && !cursor.equal(mark_on_selection)) {
    view.setSelection(new Range(cursor, mark_on_selection));
    mark_on_selection = null;
  }
  else {
    mark_on_selection = cursor;
  }
}

function markJump() {
  if (mark_on_selection) {
    view.setCursorPosition(mark_on_selection);
  }
}

function markClean() {
  mark_on_selection = null;
}

function help(cmd) {
  if (cmd === 'markSelection') {
    return i18n("Records the cursor position. The second call makes a selection.");
  }
  if (cmd === 'markJump') {
    return i18n("Go to the recorded cursor position.");
  }
  if (cmd === 'markClean') {
    return i18n("Removes the recorded cursor position.");
  }
}

function action(cmd)
{
  if ('markSelection' === cmd)
    return {
      category: "Selection",
      interactive: false,
      text: i18n("Records position or makes a selection."),
      shortcut: "Ctrl+3"
    };
}
