#!/usr/bin/env node

const filename = process.argv[2]

if (!filename) {
  console.error(`${process.argv[1]} abbreviations_file`)
  process.exit(1)
}

const lines = require('fs').readFileSync(filename, 'utf8').split('\n')
const header = lines[0].split(' ')
const revision = header[1] || '1'
const cat = header[0]
const abbrs = {}

for (let iline = 1; iline < lines.length; ++iline)
{
  const line = lines[iline];
  if (!line) continue
  const a = line.split("'")
  const infos = a[0].split(' ')
  let txt = a.slice(1).join('')
  const addLine = txt.indexOf('${line}');
  txt = txt.replace('${line}', '')
  const pos = txt.indexOf('${cursor}');
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

const println = console.log;

const abbrKeys = Object.keys(abbrs)

println('var katescript = {')
println('  "author": "Jonathan Poelen <jonathan.poelen+katescript@gmail.com>",')
println('  "license": "BSD",')
println('  "revision": ' + revision + ',')
println('  "kate-version": "5.1",')
println('  "functions": ["' + abbrKeys.join('", "') + '"],')
println('  "actions": [')
println(abbrKeys.map((k) => `    {"function": "${k}", "category": "${cat}", "interactive": false, "name": ${abbrDesc(abbrs[k])}, "shortcut": "${abbrs[k].shortcut}"}`).join(',\n'))
println('  ]')
println("};\n")


// make functions

println("require('cursor.js')\n")

for (const k in abbrs)
{
  println('function ' + k + '() {')
  const abbr = abbrs[k]
  const t = abbr.text
  const addLine = (abbr.addLine !== -1) ? '+document.line(c.line).trim()+\''+t.substring(abbr.addLine)+'\'' : ''
  const tline = (abbr.addLine !== -1) ? "'" + t.substring(0, abbr.addLine) + "'" + addLine : ''

  if (!abbr.pos && abbr.text[0] != ' ')
  {
    if (abbr.addLine !== -1)
    {
      println('  const c = view.cursorPosition();')
      println('  document.insertText(c, ' + tline + ')')
    }
    else
    {
      println('  document.insertText(view.cursorPosition(), \'' + t + '\')')
    }
  }
  else
  {
    println('  const c = view.cursorPosition();')

    if (abbr.text[0] != ' ')
    {
      if (abbr.addLine !== -1)
      {
        println('  const t = ' + tline)
        println('  document.insertText(c, t)')
      }
      else
      {
        println('  document.insertText(c, \'' + t + '\')')
      }
    }
    else
    {
      const cond = "document.charAt(c) == ' ' ? '" + t.substring(1) + "' : '" + t + "'"
      if (abbr.addLine !== -1)
      {
        cond = '(' + cond + ')' + addLine + "'" + suffix + "'"
      }
      println(abbr.pos
        ? '  const t = ' + cond + '\n' +
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
for (const k in abbrs)
{
  println(`  if (cmd === '${k}') return i18n('insert "${abbrs[k].text}"')`)
}
println('}')
