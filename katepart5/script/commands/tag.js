const katescript = {
  "author": "Jonathan Poelen <jonathan.poelen+katescript@gmail.com>",
  "license": "BSD",
  "revision": 2,
  "kate-version": "5.1",
  "functions": [ "set-namespace-tag"
               , "set-always-write-namespace"
               , "set-is-block-tag"
               , "tag"
               , "wrapTag"
               ],
  "actions": [
    { "function": "wrapTag"
    , "name": "Wrap selection or line with a XML tag"
    , "category": "Editing"
    , "shortcut": "Ctrl+Alt+N"
    , "interactive": true
    }
  ]
};

require("jln/indentationText.js")
require("jln/toBoolean.js")
require("range.js")

let namespaceStr = "";
let alwaysWriteNamespace = true;
let isBlockTag = false;

this["set-namespace-tag"] = function(namespace){
  namespaceStr = namespace || "";
};

this["set-always-write-namespace"] = function(always){
  alwaysWriteNamespace = toBoolean(always);
};

this["set-is-block-tag"] = function(isBlock){
  isBlockTag = toBoolean(isBlock);
};

const processTagName = function(tagName)
{
  if (namespaceStr && (alwaysWriteNamespace || namespaceStr + ":" !== tagName.substr(0, namespaceStr.length + 1)))
  {
    return namespaceStr + ":" + tagName;
  }
  return tagName;
}

function tag(tagName, isBlock)
{
  let cursor;
  let indent;

  document.editBegin();

  if (view.hasSelection())
  {
    isBlock = tagName;
    tagName = view.selectedText();
    indent = indentationText(view.selection().start.line);
    view.removeSelectedText();
    cursor = view.cursorPosition();
  }
  else
  {
    cursor = view.cursorPosition();
    const line = cursor.line;
    indent = indentationText(line);

    // name is missing or starts with a digit
    // => assume that name is isBlock
    if (tagName === undefined || !isNaN(+tagName))
    {
      isBlock = tagName;
      let rc1 = cursor.column;
      tagName = document.line(line);

      while (tagName[--rc1] && (/[\w-:_]/).test(tagName[rc1]));
      ++rc1;
      const re = /[\w-:_]+/g;
      re.lastIndex = rc1;

      if (!(tagName = re.exec(tagName)[0]))
        return ;
      rc1 = re.lastIndex - tagName.length;
      cursor.column = rc1;
      document.removeText(line, rc1, line, re.lastIndex);
    }
  }

  if (tagName)
  {
    tagName = processTagName(tagName);

    if (isBlock ? toBoolean(isBlock) : isBlockTag)
    {
      const line = cursor.line + 1;
      document.insertText(cursor, "<"+tagName+">\n"+indent+"\n"+indent+"</"+tagName+">");
      view.setCursorPosition(line, 0);
      document.indent(new Range(line, 0, line, 0), 1);
    }
    else
    {
      document.insertText(cursor, "<"+tagName+">"+"</"+tagName+">");
      view.setCursorPosition(cursor.line, cursor.column + tagName.length + 2);
    }
  }

  document.editEnd();
}


function wrapTag(tagName, isBlock, attributes)
{
  if (!tagName) return;

  tagName = processTagName(tagName);
  isBlock = isBlock ? toBoolean(isBlock) : isBlockTag;
  attributes = attributes ? ' ' + attributes : '';

  document.editBegin();

  if (view.hasSelection())
  {
    const range = view.selection();
    const text = view.selectedText();

    if (isBlock)
    {
      const line = range.start.line;
      const column = Math.max(document.firstColumn(line), 0);
      const indent = document.text(line, 0, line, column);
      const lineLength = document.lineLength(line);
      const isStartColumn = (column === range.start.column);
      let isEndColumn = (lineLength === range.end.column);

      if (isEndColumn)
      {
        view.removeSelectedText();
      }
      else
      {
        let newColumn = document.nextNonSpaceColumn(range.end);
        if (newColumn === -1) {
          newColumn = document.lineLength(range.end.line);
        }
        document.removeText(range.start, new Cursor(range.end.line, newColumn));
        isEndColumn = (lineLength === newColumn);
      }

      const prefix = (isStartColumn ? "" : "\n" + indent);
      const suffix = (isEndColumn ? "" : "\n" + indent);
      document.insertText(range.start, prefix+"<"+tagName+attributes+">\n"+indent+text+"\n"+indent+"</"+tagName+">"+suffix);

      if (!isStartColumn)
      {
        range.start.line++;
        range.start.column = indent.length;
      }

      range.end.line += 2 + (isStartColumn ? 0 : 1);
      range.end.column = indent.length + tagName.length + 3;

      document.indent(new Range(range.start.line + 1, 0, range.end.line - 1, 1), 1);
    }
    else
    {
      view.removeSelectedText();
      document.insertText(range.start, "<"+tagName+attributes+">"+text+"</"+tagName+">");
      range.end.column += attributes.length + (range.onSingleLine() ? tagName.length * 2 + 5 : tagName.length + 3);
    }

    view.setSelection(range);
  }
  else
  {
    const cursor = view.cursorPosition();
    const line = cursor.line;
    const lineLength = document.lineLength(line);
    const column = Math.max(document.firstColumn(line), 0);
    const text = document.text(line, column, line, lineLength);

    document.removeText(line, column, line, lineLength);

    if (isBlock)
    {
      const indent = document.text(line, 0, line, column);
      const newLine = line + 1;
      document.insertText(line, column, "<"+tagName+attributes+">\n"+indent+text+"\n"+indent+"</"+tagName+">");
      view.setCursorPosition(newLine, 0);
      document.indent(new Range(newLine, 0, newLine, 0), 1);
      view.setCursorPosition(newLine, cursor.column + document.lineLength(newLine) - lineLength);
    }
    else
    {
      document.insertText(line, column, "<"+tagName+attributes+">"+text+"</"+tagName+">");
      view.setCursorPosition(line, cursor.column + tagName.length + attributes.length + 2);
    }
  }

  document.editEnd();
}


function help(cmd)
{
  if (cmd === "set-always-write-namespace")
    return i18n("Defines if the namespace must be written by <i>tag</i> even if it is already indicated in the name.\
<br/><br/>set-always-write-namespace(always: bool = false)");

  if (cmd === "set-is-block-tag")
    return i18n("Defines if the tag added with <i>tag</i> should be inline or block.\
<br/><br/>set-is-block-tag(indent: bool = false)");

  if (cmd === "set-namespace-tag")
    return i18n("Defines the namespace to add with <i>tag</i>.\
<br/><br/>set-namespace-tag(namespace: String = '')");

  if (cmd === "tag")
    return i18n("If no parameter is passed transforms the selection or the text into tag.\
<br/><br/>tag([tagName: String, ]isBlock: bool = false)\
<br/><i>isBlock</i>: If true, new line + indentation.");

  if (cmd === "wrapTag")
    return i18n("Wrap selection or line with a tagName.\
<br/><br/>wrapTag(tagName: String[, isBlock: bool = false[, attributes: String]])");
}
