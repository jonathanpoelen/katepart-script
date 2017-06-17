var katescript = {
  "author": "Jonathan Poelen <jonathan.poelen+katescript@gmail.com>",
  "license": "BSD",
  "revision": 1,
  "kate-version": "5.1",
  "functions": ["nextArg","prevArg"],
  "actions": [
    { "function": "nextArg"
    , "category": "Editing"
    , "name": "Next Argument"
    , "shortcut": "Ctrl+ð"
    },
    { "function": "prevArg"
    , "category": "Editing"
    , "name": "Previous Argument"
    , "shortcut": "Ctrl+ð"
    }
  ]
};

require('cursor.js')


function nextArg()
{
  var rgx = (/[,(<{\[]/g)
  var cur = view.cursorPosition()
  var pos = 0
  if (cur.column > 0) {
    pos = cur.column - 1
    rgx.lastIndex = 1
  }
  var text = document.text(
    cur.line, pos,
    cur.line, document.lineLength(cur.line))
  if (testNextArg(rgx, text)) {
    setPositionNextArg(rgx, cur, text, pos)
  }
  else {
    var lenLine = document.lines()
    while (++cur.line <= lenLine) {
      text = document.line(cur.line)
      if (testNextArg(rgx, text)) {
        setPositionNextArg(rgx, cur, text, 0)
        break
      }
    }
  }
}

function prevArg()
{
  var rgx = (/[,)>}\]]/g)
  var cur = view.cursorPosition()
  var text = document.text(new Cursor(cur.line, 0), cur)
  if (rgx.test(text)) {
    setPositionPrevArg(rgx, cur, text)
  }
  else {
    while (--cur.line >= 0) {
      text = document.line(cur.line)
      if (rgx.test(text)) {
        setPositionPrevArg(rgx, cur, text)
        break
      }
    }
  }
}

function testNextArg(rgx, text)
{
  if (rgx.test(text))
  {
    var test = true
    while (
      text[rgx.lastIndex-1] === '<' && (
        text[rgx.lastIndex-2] === ' ' ||
        text[rgx.lastIndex-2] === '<'
      ) &&
      (test = rgx.test(text))
    ) {
    }
    return test
  }
  return false
}

function setPositionNextArg(rgx, cur, text, pos)
{
  if (text[rgx.lastIndex-1] === ',') {
    ++pos;
  }
  view.setCursorPosition(cur.line, pos + rgx.lastIndex)
}

function setPositionPrevArg(rgx, cur, text)
{
  var pos = rgx.lastIndex;
  while (rgx.test(text)) {
    pos = rgx.lastIndex;
  }
  view.setCursorPosition(cur.line, --pos)
}


function help(cmd)
{
  if (cmd === 'nextArg') return 'find ,(<{['
  if (cmd === 'prevArg') return 'find ,)>}]'
}
