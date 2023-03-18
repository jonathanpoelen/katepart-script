const katescript = {
  "author": "Jonathan Poelen <jonathan.poelen+katescript@gmail.com>",
  "license": "BSD",
  "revision": 2,
  "kate-version": "5.1",
  "functions": [ "encodeUri", "decodeUri" ]
};

require("jln/selectionOrLineProcess.js")

const _encodeUri = function(fn, args)
{
  if (args.length) {
    document.insertText(view.cursorPosition(), fn(Array.prototype.join.call(args, ' ')));
  }
  else {
    selectionOrLineProcess(true, true, function(text, cursor) {
      text = fn(text);
      if (cursor)
        cursor.column = text.length;
      return text;
    });
  }
}

function encodeUri() { _encodeUri(encodeURI, arguments); }
function decodeUri() { _encodeUri(decodeURI, arguments); }


function help(cmd)
{
  if (cmd === "encodeUri")
    return i18n("Encode parameter, selection ou line.\
<br/><br/>encodeUri(...uri: String)");

  if (cmd === "decodeUri")
    return i18n("Decode parameter, selection ou line.\
<br/><br/>decodeUri(...uri: String)");
}
