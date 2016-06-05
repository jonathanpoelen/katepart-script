/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: markSelection, markExpand, markJump, markClean
 */

require ("range.js");

var mark_on_selection = null;
var mark_on_selection2 = null;

function markSelection() {
  var cursor = view.cursorPosition();
  if (mark_on_selection && !cursor.equals(mark_on_selection)) {
    view.setSelection(new Range(cursor, mark_on_selection));
    mark_on_selection2 = mark_on_selection;
    mark_on_selection = null;
  }
  else {
    mark_on_selection = cursor;
    mark_on_selection2 = null;
  }
}

function markExpand() {
  var cursor = view.cursorPosition();
  if (view.hasSelection()) {
    var selection = view.selection();
    if (selection.end.compareTo(cursor) >= 0 && selection.start.compareTo(cursor) > 0) {
      view.setSelection(new Range(cursor, selection.end));
    }
    else {
      view.setSelection(new Range(selection.start, cursor));
    }
  }
  else {
    mark_on_selection2 = mark_on_selection2 || mark_on_selection;
    if (mark_on_selection2) {
      view.setSelection(new Range(cursor, mark_on_selection2));
    }
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
  if (cmd === 'markExpand') {
    return i18n("Extends selection or makes a selection from recorded cursor position.");
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
  if ('markExpand' === cmd)
    return {
      category: "Selection",
      interactive: false,
      text: i18n("Extends selection or makes a selection from recorded position."),
      shortcut: "Ctrl+4"
    };
}
