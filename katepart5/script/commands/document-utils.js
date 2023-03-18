const katescript = {
  "author": "Jonathan Poelen <jonathan.poelen+katescript@gmail.com>",
  "license": "BSD",
  "revision": 2,
  "kate-version": "5.1",
  "functions": [
    "filename",
    "extension",
    "path",
    "url",
    "mimeType",
    "encoding",
    "highlightingMode"
  ]
};

require("jln/toBoolean.js")

const _getName = function(name, noExt)
{
  return (toBoolean(noExt) && 1 <= (noExt = name.lastIndexOf('.')))
    ? name.substr(0, noExt)
    : name;
}

const _insertText = function(text)
{
  document.insertText(view.cursorPosition(), text);
}

function filename(noExt)
{
  _insertText(_getName(document.fileName(), noExt));
}

function extension()
{
  const name = document.fileName();
  const pos = name.lastIndexOf('.');

  if (pos >= 1)
    _insertText(name.substr(pos + 1));
}

const _insertUrl = function(removeProtocol, nDir, sep, noExt)
{
  let url = document.url();
  let start = url.indexOf('/') + 2;
  nDir |= 0;

  if (nDir > 0)
  {
    let pos = url.length;
    while (nDir-- > 0 && start <= (pos = url.lastIndexOf('/', pos - 1)))
      ;
    ++pos;

    if (removeProtocol || (pos === start ? nDir === 0 : pos > start))
      url = url.substr(pos);
  }

  else if (nDir < 0)
  {
    let pos = start;
    while (nDir++ < 0) {
      if (-1 === (pos = url.indexOf('/', pos)))
        return;
      ++pos;
    }
    url = url.substr(pos);
  }

  else if (removeProtocol)
    url = url.substr(start);

  url = _getName(url, noExt);
  if (sep && sep !== '/')
    url = url.replace(/\//g, sep)
  _insertText(url);
}

function path(nDir, sep, noExt) { _insertUrl(true, nDir, sep, noExt); }
function url(nDir, sep, noExt) { _insertUrl(false, nDir, sep, noExt); }
function mimeType() { _insertText(document.mimeType()); }
function encoding() { _insertText(document.encoding()); }

function highlightingMode(atCursor)
{
  const cursor = view.cursorPosition();
  const mode = toBoolean(atCursor)
    ? document.highlightingModeAt(cursor)
    : document.highlightingMode();
  document.insertText(cursor, mode);
}

function help(cmd)
{
  if (cmd === "filename")
    return i18n("Insert filename.\
<br/><br/>filename(noExt: bool = false)");

  if (cmd === "extension")
    return i18n("Insert extension.\
<br/><br/>extension()");

  if (cmd === "path")
    return i18n("Insert file path.\
<br/><br/>path(nDir: int = 0, directorySeparatorReplacement: String = '/', noExt: bool = false)\
<br/><br/>When nDir is positive, it corresponds to the number of elements to keep.\
<br/><br/>when nDir is negative, it corresponds to the number of elements to delete.");

  if (cmd === "url")
    return i18n("Insert url path (file:// followed by the file path).\
<br/><br/>url(nDir: int = 0, directorySeparatorReplacement: String = '/', noExt: bool = false)\
<br/><br/>When nDir is positive, it corresponds to the number of elements to keep.\
<br/><br/>when nDir is negative, it corresponds to the number of elements to delete.");

  if (cmd === "mimeType")
    return i18n("Insert mime-type.\
<br/><br/>mimeTypes()");

  if (cmd === "encoding")
    return i18n("Insert encoding.\
<br/><br/>encoding()");

  if (cmd === "highlightingMode")
    return i18n("Insert highlighting mode used for the whole document or at cursor position.\
<br/><br/>highlightingMode(atCursor: bool = false)");
}
