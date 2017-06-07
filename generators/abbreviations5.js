// kjscmd -n ./generators/abbreviations5.js < ./abbreviations/cpp 2>/dev/null

var header = readln().split(' ')
var revision = header[1] || '1'
var cat = header[0]
var abbrs = {}

var l
while (l = readln())
{
  var a = l.split("'")
  var infos = a[0].split(' ')
  var txt = a.slice(1).join('')
  var addLine = txt.indexOf('${line}');
  txt = txt.replace('${line}', '')
  var pos = txt.indexOf('${cursor}');
  txt = txt.replace('${cursor}', '')
  abbrs[cat+'_'+infos[0]] = {
    shortcut: infos[1],
    pos: pos === -1 ? 0 : pos - txt.length,
    addLine: addLine,
    text: txt
  }
}

function abbrDesc(abbr)
{
  return '"insert \\\"' + abbr.text.replace(/&/g, '\\&') + '\\\""'
}

// katescript header

println('var katescript = {')
println('  "author": "Jonathan Poelen <jonathan.poelen+katescript@gmail.com>",')
println('  "license": "BSD",')
println('  "revision": ' + revision + ',')
println('  "kate-version": "5.1",')
println('  "functions": ["' + Object.keys(abbrs).join('", "') + '"],')
println('  "actions": [')
for (var k in abbrs)
{
  println(
    '    {"function": "' + k +
    '", "category": "' + cat +
    '", "interactive": false'+
    ', "name": ' + abbrDesc(abbrs[k]) +
    ', "shortcut": "' + abbrs[k].shortcut +
    '"},'
  )
}
println('  ]')
println("};\n")


// make functions

println("require('cursor.js')\n")

for (var k in abbrs)
{
  println('function ' + k + '() {')
  var abbr = abbrs[k]
  var t = abbr.text
  var addLine = (abbr.addLine !== -1) ? '+document.line(c.line).trim()+\''+t.substring(abbr.addLine)+'\'' : ''
  var tline = (abbr.addLine !== -1) ? "'" + t.substring(0, abbr.addLine) + "'" + addLine : ''

  if (!abbr.pos && abbr.text[0] != ' ')
  {
    if (abbr.addLine !== -1)
    {
      println('  var c = view.cursorPosition();')
      println('  document.insertText(c, ' + tline + ')')
    }
    else
    {
      println('  document.insertText(view.cursorPosition(), \'' + t + '\')')
    }
  }
  else
  {
    println('  var c = view.cursorPosition();')

    if (abbr.text[0] != ' ')
    {
      if (abbr.addLine !== -1)
      {
        println('  var t = ' + tline)
        println('  document.insertText(c, t)')
      }
      else
      {
        println('  document.insertText(c, \'' + t + '\')')
      }
    }
    else
    {
      var cond = "document.charAt(c) == ' ' ? '" + t.substring(1) + "' : '" + t + "'"
      if (abbr.addLine !== -1)
      {
        cond = '(' + cond + ')' + addLine + "'" + suffix + "'"
      }
      println(abbr.pos
        ? '  var t = ' + cond + '\n' +
          '  document.insertText(c, t)'
        : '  document.insertText(c, ' + cond + ')'
      )
    }
    if (abbr.pos)
    {
      println('  c.column += ' + (abbr.text[0] == ' ' || abbr.addLine !== -1 ? 't.length - ' + -abbr.pos : t.length + abbr.pos))
      println('  view.setCursorPosition(c)')
    }
  }
  println("}\n")
}


// make help function

println('function help(cmd) {')
for (var k in abbrs)
{
  println("  if (cmd === '" + k + "') return i18n('insert \"" + abbrs[k].text + '"\')')
}
println('}')
