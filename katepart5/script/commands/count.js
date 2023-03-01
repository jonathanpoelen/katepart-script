const katescript = {
  "author": "Jonathan Poelen <jonathan.poelen+katescript@gmail.com>",
  "license": "BSD",
  "revision": 2,
  "kate-version": "5.1",
  "functions": ["count"]
};

require("range.js")

function count(opt, rgx)
{
  const cursor = view.cursorPosition();
  let n;

  if (opt === 'l')
  {
    if (view.hasSelection())
    {
      const range = view.selection();
      n = range.end.line - range.start.line + 1;
    }
    else
    {
      n = 1;
    }
  }
  else
  {
    const text = view.hasSelection() ? view.selectedText() : document.line(cursor.line);
    let reg;
    /**/ if (opt === 'w') reg = /\W+/;
    else if (opt === 'W') reg = /[^-_:\w]+/;
    else if (opt === 'r') reg = new RegExp(rgx);
    else n = text.length;

    if (reg)
    {
      const frags = text.split(reg);
      n = frags.length;
      n -= !frags[0].length + (n > 1 ? !frags[n-1].length : 0);
    }
  }

  document.editBegin();
  document.insertText(cursor, n);
  document.editEnd();
}

function help(cmd)
{
  if (cmd === "count")
    return i18n("Counts the number of characters, lines, words or long words\
 in the line or selection and writes it at the cursor position.\
<br/><br/>count(opt: String = 'c', rgx: String|undefined)\
<br/>`opt`:\
<br/>- 'c' for character\
<br/>- 'l' for line\
<br/>- 'w' pour word\
<br/>- 'W' for long word\
<br/>- 'r' for regex separator");
}
