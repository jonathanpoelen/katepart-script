/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: set-namespace-tag, set-always-write-namespace, set-is-block-tag, tag, wrapTag
 */

require("toBoolean.js")
require("edit.js")

var namespaceStr = "";

this["set-namespace-tag"] = function(namespace){
  namespaceStr = namespace || "";
}

var alwaysWriteNamespace = true;
var isBlockTag = false;

this["set-always-write-namespace"] = function(always){
  alwaysWriteNamespace = toBoolean(always);
}

this["set-is-block-tag"] = function(isBlock){
  isBlockTag = toBoolean(isBlock);
}

function tag(name, isBlock)
{
  var cursor, hasSelection = view.hasSelection();
  var edit = false;
  if (hasSelection)
  {
    isBlock = name || isBlockTag;
    name = view.selectedText();
    cursor = view.selection().start;
    view.removeSelectedText();
    edit = true;
    document.editBegin();
  }
  else
  {
    cursor = view.cursorPosition();

    if (name === undefined || !isNaN(+name))
    {
      isBlock = name || isBlockTag;
      var line = cursor.line, rc1, rc2;
      var isCharNode = function(c){
        return c && (/\w|:|_|-/g).test(c);
      };
      rc1 = rc2 = cursor.column;
      name = document.line(line);

      while (isCharNode(name[--rc1]));
      while (isCharNode(name[rc2++]));

      cursor.column = ++rc1;
      if (!(name = name.substring(rc1, --rc2)))
        return ;
      edit = true;
      document.editBegin();
      document.removeText(line, rc1, line, rc2);
    }
  }

  if (name)
  {
    insertTag(cursor, name, toBoolean(isBlock));
    if (edit)
      document.editEnd();
  }
}


function insertTag(cursor, name, isBlock, str)
{
  if (namespaceStr && (alwaysWriteNamespace || namespaceStr+":" !== name.substr(0, namespaceStr.length + 1)))
    name = namespaceStr+":"+name;
  if (isBlock)
  {
    isBlock = (/\s+/).exec(document.line(cursor.line)) || "";
    document.insertText(cursor, "<"+name+">\n"+isBlock+"\t"+(str||"")+"\n"+isBlock+"</"+name+">");
    view.setCursorPosition(cursor.line + 1, document.lineLength(cursor.line + 1));
  }
  else
  {
    document.insertText(cursor, "<"+name+">"+(str||"")+"</"+name+">");
    view.setCursorPosition(cursor.line, cursor.column + name.length + 2);
  }
}


function wrapTag(/*[str, ]name, isBlock*/)
{
  editText(arguments, function(str, name, isBlock){
    insertTag(view.cursorPosition(), name, toBoolean(isBlock), str);
  }, true);
}

function action(cmd)
{
  if ("tag" === cmd)
    return {
      category: "Editing",
      interactive: false,
      text: i18n("Create a new XML tag"),
      shortcut: "Ctrl+Alt+N"
    };
}

function help(cmd)
{
  if (cmd === "set-always-write-namespace")
    return i18n("Définit si le namespace doit être écrit pat la fonction tag même s'il est déjà indiqué dans le nom.\
<br/><br/>set-always-write-namespace(always: Boolean= false)");

  if (cmd === "set-is-block-tag")
    return i18n("Définit si la balise ajouté par doit tag être écrite en ligne ou en bloc.\
<br/><br/>set-is-block-tag(indent: Boolean= false)");

  if (cmd === "set-namespace-tag")
    return i18n("Définit le namespace à ajouter pour la fonction tag.\
<br/><br/>set-namespace-tag(namespace: String= '')");

  if (cmd === "tag")
    return i18n("Si aucun paramètre n'est passé transforme la sélection ou le texte en tag.\
<br/><br/>tag(name: String, isBlock: Boolean= false)\
<br/>isBlock: Si vrai saut de ligne + indentation.");

  if (cmd === "wrapTag")
    return i18n("Si aucun paramètre n'est passé entoure la sélection ou le texte avec un tag.\
<br/><br/>wrapTag(str: String, name: String, isBlock: Boolean= false)\
<br/>str: Si une sélection existe ce paramètre est ignoré.");
}
