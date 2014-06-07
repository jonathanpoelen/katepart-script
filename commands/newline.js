/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: newline, smartNewline, newlineOfCCode, smartNewlineOfCCode
 */

require("toBoolean.js");
require("range.js");


var window = this;

["smartNewline", "newline"].forEach(function(name){
  window[name+"OfCCode"] = function(){
    document.editBegin();
    var cursor = view.cursorPosition();
    cursor.column = document.lineLength(cursor.line);
    document.insertText(cursor, ";");
    //window[name].apply(window[name], arguments);
    window[name]();
    document.editEnd();
  };
});


function newline(up, noKeepBlank)
{
  var cursor = view.cursorPosition();
  var column = document.firstColumn(cursor.line);
  var blank = toBoolean(noKeepBlank) ? "" : ((-1 === column) ? document.line(cursor.line) : document.text(cursor.line, 0, cursor.line, column));
  if (toBoolean(up))
    document.insertText(cursor.line, 0, blank + "\n")
  else
  {
    document.insertText(cursor.line, document.lineLength(cursor.line), "\n" + blank);
    ++cursor.line;
    view.setCursorPosition(cursor);
  }
}


function smartNewline()
{
  var cursor = view.cursorPosition();
  var text = document.line(cursor.line);
  var index = text.search(/\w/);
  document.insertText(cursor.line, document.lineLength(cursor.line),
                      "\n" + (-1 === index ? text : text.substr(0, index)));
  ++cursor.line;
  view.setCursorPosition(cursor);
}


function action(cmd)
{
  if ("newline" === cmd)
    return {
      icon: "",
      category: "",
      interactive: false,
      text: i18n("Create Newline"),
      shortcut: "Ctrl+Return"
    };
  if ("smartNewline" === cmd)
    return {
      icon: "",
      category: "",
      interactive: false,
      text: i18n("Create Smart Newline"),
      shortcut: "Ctrl+Alt+Return"
    };
  if ("newlineOfCCode" === cmd)
    return {
      icon: "",
      category: "",
      interactive: false,
      text: i18n("Semicolon at end of line and new line"),
      shortcut: "Ctrl+Shift+Return"
    };
  if ("smartNewlineOfCCode" === cmd)
    return {
      icon: "",
      category: "",
      interactive: false,
      text: i18n("Semicolon at end of line and new line"),
      shortcut: "Ctrl+Shift+Alt+Return"
    };
}


function help(cmd)
{
  if (cmd === "newline")
    return i18n("Va à la ligne en y ajoutant le nombre d'espace blanc de la ligne de départ.\
<br/><br/>newline(up: Boolean= false, noKeepBlank: Boolean= false)\
<br/>up: Si vrai, crée la ligne au-dessus de celle courante.\
<br/>noKeepBlank: Si vrai, crée une ligne vide.");

  if (cmd === "newlineOfCCode")
    return i18n("Ajoute un point virgule en fin de ligne puis utilise newline.\
<br/><br/>newlineOfCCode()");

  if (cmd === "smartNewline")
    return i18n("Va à la ligne en y ajoutant les caractères non alpanumérique de la ligne de départ.\
<br/><br/>smartNewline()");

  if (cmd === "smartNewlineOfCCode")
    return i18n("Ajoute un point virgule en fin de ligne puis utilise smartNewline.\
<br/><br/>smartNewlineOfCCode()");
}
