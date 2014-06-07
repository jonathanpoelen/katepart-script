require("cursor.js")

var Position = {
  recoil: function(cursor, n){
    n = n || 1;
    while (n) {
      if (n > cursor.column) {
        n -= cursor.column + 1;
        if (--cursor.line === -1)
          return null;
        cursor.column = document.lineLength(cursor.line);
      } else {
        cursor.column -= n;
        n = 0;
      }
    }
    return cursor;
  },
  advance: function(cursor, n){
    n = n || 1;
    var length, lines = document.lines();
    while (n) {
      length = document.lineLength(cursor.line);
      if (n > length - cursor.column) {
        n -= (length - cursor.column) + 1;
        if (++cursor.line === lines)
          return null;
        cursor.column = 0;
      } else {
        cursor.column += n;
        n = 0;
      }
    }
    return cursor;
  },
  move: function(cursor, n){
    return (n > 0) ? Position.advance(cursor, n) : Position.recoil(cursor, -n);
  },
  moveIfTest: function(cursor, sens, rgx, result){
    while (result === rgx.test(document.charAt(cursor))
      && (cursor = sens(cursor)))
      ;
    return cursor;
  },
  search: function(rgx, cursor, n, run){
    var ret = cursor.clone(), fnNext;
    if (n < 0) {
      n = -n;
      fnNext = Position.recoil;
      ret = fnNext(ret, 1);
    } else {
      n = n || 1;
      fnNext = Position.advance;
    }

    if (run) {
      if (!run(ret, fnNext, rgx, n))
        return cursor;
    } else if (Position.moveIfTest(ret, fnNext, rgx, false)) {
      while (n-- && Position.moveIfTest(ret, fnNext, rgx, true)
        && n && Position.moveIfTest(ret, fnNext, rgx, false)) {
      }
    } else {
      return cursor;
    }

    if (ret.line === -1) {
      if (fnNext === Position.advance) {
        ret.line = document.lines() - 1;
        ret.column = document.lineLength(ret.line);
      } else {
        ret.line = ret.column = 0;
      }
    } else if (fnNext === Position.recoil && !Position.advance(ret)) {
      --ret.line;
    }
    return ret;
  },
  strrfind: function(cursor, str, exclude){
    var cursor = document.rfind(cursor, str);
    if (exclude && cursor.isValid()) {
      var lines = str.countLine();
      if (lines === 1)
        cursor.column += str.length;
      else {
        cursor.line += lines - 1;
        cursor.column = str.length - 1 - str.lastIndexOf("\n");
      }
    }
    return cursor;
  },
  strfind: function(cursor, str, exclude){
    var line = cursor.line;
    var column = cursor.column;
    var lineEnd = document.lines();
    var lineLength = document.lineLength(line);
    while (!document.matchesAt(line, column, str)) {
      while (++column === lineLength) {
        if (++line === lineEnd)
          return cursor.invalid();
        lineLength = document.lineLength(line) || 1;
        column = 0;
      }
    }
    cursor = new Cursor(line, column);
    return exclude ? cursor : Position.advance(cursor, str.length);
  },
  start: function(){
    return view.hasSelection() ? view.selection().start : view.cursorPosition();
  },
  end: function(){
    return view.hasSelection() ? view.selection().end : view.cursorPosition();
  }
};
