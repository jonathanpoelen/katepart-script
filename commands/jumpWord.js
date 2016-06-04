/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: wordNext, wordPrev, blankNext, blankPrev, wordEndNext, wordEndPrev, blankEndNext, blankEndPrev
 */

/**
 * Move cursor to next/previous word
 */

require("range.js");

var rgx_word = /[A-Za-z0-9]/;
var rgx_blank = /\s/;

function wordNext()     { _pattern_next(rgx_word,  true); }
function wordPrev()     { _pattern_prev(rgx_word,  true); }
function blankNext()    { _pattern_next(rgx_blank, true); }
function blankPrev()    { _pattern_prev(rgx_blank, true); }
function wordEndNext()  { _pattern_next(rgx_word,  false); }
function wordEndPrev()  { _pattern_prev(rgx_word,  false); }
function blankEndNext() { _pattern_next(rgx_blank, false); }
function blankEndPrev() { _pattern_prev(rgx_blank, false); }

function action(cmd)
{
  if ('wordNext' === cmd)
    return {
      category: "Navigation",
      interactive: false,
      text: i18n("Move cursor to next word")
    };
  if ('wordPrev' === cmd)
    return {
      category: "Navigation",
      interactive: false,
      text: i18n("Move cursor to previous word")
    };
  if ('blankNext' === cmd)
    return {
      category: "Navigation",
      interactive: false,
      text: i18n("Move cursor to next blank word")
    };
  if ('blankPrev' === cmd)
    return {
      category: "Navigation",
      interactive: false,
      text: i18n("Move cursor to previous blank word")
    };
  if ('wordEndNext' === cmd)
    return {
      category: "Navigation",
      interactive: false,
      text: i18n("Move cursor to end to next word")
    };
  if ('wordEndPrev' === cmd)
    return {
      category: "Navigation",
      interactive: false,
      text: i18n("Move cursor to end to previous word")
    };
  if ('blankEndNext' === cmd)
    return {
      category: "Navigation",
      interactive: false,
      text: i18n("Move cursor to end to next blank word")
    };
  if ('blankEndPrev' === cmd)
    return {
      category: "Navigation",
      interactive: false,
      text: i18n("Move cursor to end to previous blank word")
    };
}

function help(cmd) {
  if (cmd === 'wordNext') {
    return i18n("Move cursor to next word");
  }
  if (cmd === 'wordPrev') {
    return i18n("Move cursor to previous word");
  }
  if (cmd === 'blankNext') {
    return i18n("Move cursor to next blank word");
  }
  if (cmd === 'blankPrev') {
    return i18n("Move cursor to previous blank word");
  }
  if (cmd === 'wordEndNext') {
    return i18n("Move cursor to end to next word");
  }
  if (cmd === 'wordEndPrev') {
    return i18n("Move cursor to end to previous word");
  }
  if (cmd === 'blankEndNext') {
    return i18n("Move cursor to end to next blank word");
  }
  if (cmd === 'blankEndPrev') {
    return i18n("Move cursor to end to previous blank word");
  }
}


function _pattern_next(rgx, stop_on_begin)
{
  var cursor = view.cursorPosition();

  var len = document.lineLength(cursor.line);
  var lines = document.lines();

  for (var i = 0; i < 2; ++i) {
    var rgx_r = i == stop_on_begin;
    while (1) {
      if (++cursor.column >= len) {
        if (++cursor.line === lines) {
          --cursor.line;
          cursor.column = len;
          break ;
        }
        cursor.column = 0;
        len = document.lineLength(cursor.line);
      }
      if (rgx_r === rgx.test(document.charAt(cursor))) {
        break ;
      }
    }
  }

  view.setCursorPosition(cursor);
}

function _pattern_prev(rgx, stop_on_begin)
{
  var cursor = view.cursorPosition();

  for (var i = 0; i < 2; ++i) {
    var rgx_r = i != stop_on_begin;
    while (1) {
      while (!cursor.column) {
        if (--cursor.line === -1) {
          break ;
        }
        cursor.column = document.lineLength(cursor.line);
      }
      --cursor.column;
      if (rgx_r === rgx.test(document.charAt(cursor))) {
        break ;
      }
    }
  }

  ++cursor.column;
  view.setCursorPosition(cursor);
}
