var katescript = {
  "author": "Jonathan Poelen <jonathan.poelen+katescript@gmail.com>",
  "license": "BSD",
  "revision": 1,
  "kate-version": "5.1",
  "functions": ["comment2"],
  "actions": [
    { "function": "comment2"
    , "category": "Editing"
    , "name": "Comment"
    , "shortcut": "Ctrl+D"
    }
  ]
};

require('range.js')

function singleBlocComment (s, attr, startCol, endCol)
{
  var comment = document.commentMarker(attr)
  if (!comment) {
    return false
  }

  var line = s.start.line
  var lineEnd = s.end.line

  if (endCol === 0)
  {
    endCol = -1
    --lineEnd
  }

  comment += ' '
  var sline = line
  var slineEnd = lineEnd
  var minCol = startCol < 0
    ? (endCol < 0 ? 0 : endCol)
    : (endCol < 0 ? startCol : (startCol < endCol ? startCol : endCol))
  var curCol

  while (++line < lineEnd)
  {
    curCol = document.firstColumn(line)
    if (curCol < minCol && curCol !== -1)
    {
      minCol = curCol
    }
  }

  for (; sline <= slineEnd; ++sline)
  {
    document.insertText(sline, minCol, comment)
  }

  s.start.column = minCol
  view.setSelection(s)

  return true
}

function comment2 ()
{
  if (view.hasSelection())
  {
    var s = view.selection()
    var startCol = document.firstColumn(s.start.line)
    var endCol = document.lastColumn(s.end.line)
    var attr = document.attribute(s.start)
    document.editBegin()
    if (!(
       (startCol === -1 || startCol >= s.start.column)
     && endCol <= s.end.column
     && singleBlocComment(s, attr, startCol, endCol)
    ))
    {
      var start = document.commentStart(attr)
      var end = document.commentEnd(attr)
      if (start && end)
      {
        document.insertText(s.end, end)
        document.insertText(s.start, start)
        s.end.column += end.length
        if (s.start.line === s.end.line)
        {
          s.end.column += start.length
        }
        view.setSelection(s)
      }
      else
      {
        singleBlocComment(s, attr, startCol, endCol)
      }
    }
    document.editEnd()
  }
  else
  {
    var c = view.cursorPosition()
    c.column = document.firstColumn(c.line)
    var attr = document.attribute(c)
    var comment = document.commentMarker(attr)
    if (comment)
    {
      document.insertText(c, document.commentMarker(attr) + ' ')
    }
    else
    {
      var start = document.commentStart(attr)
      var end = document.commentEnd(attr)
      if (start && end)
      {
        start += ' '
        end = ' ' + end
        document.editBegin()
        document.insertText(c.line, document.lastColumn(c.line) + 1, end)
        document.insertText(c, start)
        document.editEnd()
      }
    }
  }
}

function help (cmd)
{
  if (cmd === 'comment2') return "Inserts comment"
}
