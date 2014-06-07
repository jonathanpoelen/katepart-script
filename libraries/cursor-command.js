require("position.js")
require("forEach.js")

var cursor = (function(){
  var wtest_doc_line = function(line) {
    return (/\w/).test(document.line(line));
  }
  var algorithms = {
    'p': function(cursor, n){
      var add, limit;
      if (n < 0) {
        add = -1;
        limit = 0;
        n = -n;
      } else {
        add = 1;
        limit = document.lines();
      }
      var line = cursor.line;
      while (n-- && line !== limit) {
        while (wtest_doc_line(line))
        {
          line += add;
          if (line === limit)
            break;
        }
        if (n)
        {
          var tmp = line;
          while (tmp !== limit && !wtest_doc_line(tmp))
            tmp += add;
          if (tmp !== limit)
            line = tmp;
        }
      }
      if (cursor.line !== line)
        cursor.line = !line && wtest_doc_line(tmp) ? line : line - add;
      cursor.column = add === 1 ? document.lineLength(cursor.line) : 0;
      return cursor;
    },
    'P': function(cursor, n){
      var fnNonEmptyLine, limit, add;
      if (n < 0)
      {
        fnNonEmptyLine = document.prevNonEmptyLine;
        limit = 0;
        add = -1;
        n = -n;
      }
      else
      {
        fnNonEmptyLine = document.nextNonEmptyLine;
        limit = document.lines();
        add = 1;
      }
      while (n--) {
        while (cursor.line + add === fnNonEmptyLine(cursor.line + add) && cursor.line !== limit)
          cursor.line += add;
        if (cursor.line === limit)
          break;
        if (n)
          cursor.line = fnNonEmptyLine(cursor.line + add);
      }
      cursor.column = add === 1 ? document.lineLength(cursor.line) : 0;
      return cursor;
    },
    'c': Position.move,
    'B': function(cursor, n, cursorBegin){
      if (cursorBegin) {
        if (cursor.compareTo(cursorBegin) < 0) {
          var range = getSelectionBlock(new Range(cursor, cursorBegin));
          cursorBegin.line = range.end.line;
          cursorBegin.column = range.end.column;
          return range.start;
        }
        var range = getSelectionBlock(new Range(cursorBegin, cursor));
        cursorBegin.line = range.start.line;
        cursorBegin.column = range.start.column;
        return range.end;
      }
      return cursor;
    },
    'b': Position.start,
    'e': Position.end,
    'u': function(cursor, n, cursorBegin){
      return cursorBegin ? cursorBegin.clone() : view.cursorPosition();
    },
    'i': function(cursor, n, cursorBegin, prev){
      return Position.search(prev.fn.rgx, cursor, n, function(cursor, fnNext, rgx){
        return Position.moveIfTest(cursor, fnNext, rgx, false);
      });
    }
  };

  forEach({
    w: /[\x7E-\xFF\w]/,
    W: /[-\x7E-\xFF\w]/,
    l: /[\x7E-\xFFA-Za-z]/,
    L: /[-\x7E-\xFFA-Za-z]/,
    n: /[\x7E-\xFFA-Za-z0-9]/,
    N: /[-\x7E-\xFFA-Za-z0-9]/,
    d: /\d/,
    f: /\.|\d/,
    s: /\s/
  }, function (rgx, name){
    algorithms[name] = function(cursor, n){
      return Position.search(rgx, cursor, n);
    };
    //algorithms[name].rgx = rgx;
  });

  var moveCursor = function(cursor, moveCode){
    moveCode = moveCode.split(',');
    for (var i = 0; i !== 2; ++i) {
      if (!moveCode[i]) {
        moveCode[i] = i ? Math.min(cursor.column, (document.lineLength(moveCode[0]) || 1) - 1) : cursor.line;
        continue;
      }

      var v = moveCode[i],
        c = v[0],
        limit = Math.max(0, i ? document.lineLength(moveCode[0]) : document.lines() - 1);

      if (c === '$' || c === '*')
        moveCode[i] = limit;
      else {
        if (c === '+' || c === '-')
          v = (+v||0) + cursor[i ? "column" : "line"];
        else
          v = (+v||1) - 1;

        moveCode[i] = v < 0 ? 0 : v < limit ? v : limit;
      }
    }
    return new Cursor(moveCode[0], moveCode[1]);
  };

  var letterOpt = Object.keys(algorithms).join("");
  var rgxCode = RegExp("(["+letterOpt+":])", "g");
  var rgxIgnore = RegExp("[^-"+letterOpt+":0-9,\+\*\$]", "g");

  var createOptFunc = function(name, n){
    return {fn:algorithms[name], n:n||1};
  };

  var splitCode = function(code){
    return code.replace(rgxIgnore, "")
    .replace(/[-|\+]{1,}/g, function(s){
      var strminus = s.match(/-/g);
      return strminus && strminus.length & 1 ? "-" : "+";
    }).replace(/[: ]{1,}/g, ":")
    .replace(rgxCode, "\0$1\0")
    .replace(/([\d|\*|\$](?=-|\+))/g, "$1\0")
    .split("\0")
    .filter(Boolean);
  };

  var createComponents = function(arrayCode){
    var length = arrayCode.length,
      components = new Array(length);
    for (var i = 0, n; i < length; ++i) {
      if ((component = arrayCode[i])[0] === ':')
        component = component.substr(1);
      if (component) {
        if (letterOpt.indexOf(component) === -1) {
          var n = +component;
          if (isNaN(n)){
            if (component[0] === '+')
              n = 1;
            else if (component[0] === '-')
              n = -1;
          }
          components.push(
            (!isNaN(n) && letterOpt.lastIndexOf(arrayCode[i+1]) !== -1)
            ? createOptFunc(arrayCode[++i], n)
            : {move:component}
          );
        }
        else
          components.push(createOptFunc(component));
      }
    }
    return components;
  }

  var run = function(code, cursor, cursorBegin){
    var components;
    if (!code || !(components = splitCode(code)).length)
      return new Cursor(0,0);
    createComponents(components).forEach(function(component, k, a){
      if (component.fn)
        cursor = component.fn(cursor, component.n, cursorBegin, a[k-1]);
      else// if (component.move)
        cursor = moveCursor(cursor, component.move);
    });
    return cursor;
  }

  return function(c1, c2, posC2){
    c1 = run(c1, view.cursorPosition());
    if (c2 === undefined)
      view.setCursorPosition(c1);
    else if (c1.isValid())
    {
      if ((c2 = run(c2, c1.clone(), c1)).isValid()) {
        view.setSelection(c1.compareTo(c2) === 1 ? new Range(c2, c1) :  new Range(c1, c2));
        view.setCursorPosition(toBoolean(posC2) ? c1 : c2);
      }
    }
  };
})();
