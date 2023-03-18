const katescript = {
  "author": "Jonathan Poelen <jonathan.poelen+katescript@gmail.com>",
  "license": "BSD",
  "revision": 2,
  "kate-version": "5.1",
  "functions": [ "escapeSQ", "escapeDQ", "escapeString", "escapeString2" ]
};

require("jln/selectionOrLineProcess.js")
require("jln/toBoolean.js")

const _escapeString = function(re, escapement, force, openQuote, closeQuote)
{
  selectionOrLineProcess(true, true, function(text, cursor) {
    if (!cursor)
      return text.replace(re, (c) => escapement + c);

    let column = cursor.column;
    let counter = 0;
    let last = text.length;
    let first = 0;

    if (!toBoolean(force)) {
      if (openQuote)
      {
        first = text.indexOf(openQuote);
        if (first === -1)
          return;
        first += openQuote.length;
      }

      if (closeQuote)
      {
        last = text.lastIndexOf(closeQuote);
        if (last === -1)
          return;
      }

      if (first >= last)
        return;

      column = Math.min(column, last);

      re.lastIndex = first;
    }

    text = text.replace(re, function(c, offset) {
      if (offset < first || last <= offset)
        return c;
      counter += (offset < column);
      return escapement + c;
    });
    cursor.column += counter * escapement.length;
    return text;
  });
}

function escapeSQ(force)
{
  _escapeString(/['\\]/g, '\\', force, "'", "'");
}

function escapeDQ(force)
{
  _escapeString(/["\\]/g, '\\', force, '"', '"');
}

function escapeString(pattern, escapement, quote, force)
{
  _escapeString(RegExp(pattern, 'g'), escapement || '\\', force, quote, quote);
}

function escapeString2(pattern, escapement, openQuote, closeQuote, force)
{
  _escapeString(RegExp(pattern, 'g'), escapement || '\\', force, openQuote, closeQuote);
}


function help(cmd)
{
  if (cmd === "escapeSQ")
    return i18n("Escape single quoted string in line or selection.\
<br/><br/>escapeSQ(force: bool = false)\
<br/>force: escape all characters in the line when there is no selection.\
<br/><br/>Example:\
<br/>\
<br/>>xx = 'aaa\\bbb|'ccc\"ddd';\
<br/>$ escapeSQ\
<br/>>xx = 'aaa\\\\bbb|\\'ccc\"ddd';\
<br/>\
<br/>>xx = 'aaa\\bbb|'ccc\"ddd';\
<br/>$ escapeSQ 1\
<br/>>xx = \\'aaa\\\\bbb|\\'ccc\"ddd\\';");

  if (cmd === "escapeDQ")
    return i18n("Escape double quoted string in line or selection.\
<br/><br/>escapeDQ(force: bool = false)\
<br/>force: escape all characters in the line when there is no selection.\
<br/><br/>Example:\
<br/>\
<br/>>xx = \"aaa\\bbb|'ccc\"ddd\";\
<br/>$ escapeSQ\
<br/>>xx = \"aaa\\\\bbb|'ccc\\\"ddd\";\
<br/>\
<br/>>xx = \"aaa\\bbb|'ccc\"ddd\";\
<br/>$ escapeSQ 1\
<br/>>xx = \\\"aaa\\\\bbb|'ccc\\\"ddd\\\";");

  if (cmd === "escapeString")
    return i18n("Escape character that matches a pattern in line or selection.\
<br/><br/>escapeString(pattern: RegExp, escapement: String = '\\\\', quote: String = '', force: bool = false)\
<br/>force: escape all characters in the line when there is no selection.");

  if (cmd === "escapeString2")
    return i18n("Escape character that matches a pattern in line or selection.\
<br/><br/>escapeString(pattern: RegExp, escapement: String = '\\\\', openQuote: String = '', closeQuote: String = '', force: bool = false)\
<br/>force: escape all characters in the line when there is no selection.");
}
