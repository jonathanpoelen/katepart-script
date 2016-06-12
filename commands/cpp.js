/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: cpp_noexcept, cpp_const_ref, cpp_constexpr, cpp_noexcept2, cpp_const, cpp_template, cpp_struct, cpp_class, cpp_ref, cpp_this
 */

require("cursor.js")

/*var inserted = [
  ['ñ', 'noexcept', 'noexcept '],
  ['ë', 'const_ref', 'const & '],
  ['¢', 'constexpr', 'constexpr '],
  ['Ñ', 'noexcept2', 'noexcept(noexcept())', -2],
  ['©', 'const', 'const '],
  ['þ', 'template', 'template<class >', -1],
  ['§', 'struct', 'struct '],
  ['ß', 'class', 'class '],
  ['Ë', 'ref', ' & '],
  ['Ctrl+p', 'this', 'this->'],
];*/

this["cpp_noexcept"] = function(){ document.insertText(view.cursorPosition(), "noexcept "); }

this["cpp_const_ref"] = function(){ document.insertText(view.cursorPosition(), "const & "); }

this["cpp_constexpr"] = function(){ document.insertText(view.cursorPosition(), "constexpr "); }

this["cpp_const"] = function(){ document.insertText(view.cursorPosition(), "const "); }

this["cpp_struct"] = function(){ document.insertText(view.cursorPosition(), "struct "); }

this["cpp_class"] = function(){ document.insertText(view.cursorPosition(), "class "); }

this["cpp_ref"] = function(){ document.insertText(view.cursorPosition(), " & "); }

this["cpp_this"] = function(){ document.insertText(view.cursorPosition(), "this->"); }

this["cpp_template"] = function(){
  var c = view.cursorPosition();
  document.insertText(c, "template<class >");
  c.column += 15;
  view.setCursorPosition(c);
}

this["cpp_noexcept2"] = function(){
  var c = view.cursorPosition();
  document.insertText(c, "noexcept(noexcept())");
  c.column += 18;
  view.setCursorPosition(c);
}


function action(cmd) {
  if ("cpp_noexcept" === cmd)
    return {
      category: "cpp",
      interactive: false,
      text: i18n('insert "noexcept "'),
      shortcut: "ñ"
    };
  if ("cpp_const_ref" === cmd)
    return {
      category: "cpp",
      interactive: false,
      text: i18n('insert "const \\& "'),
      shortcut: "ë"
    };
  if ("cpp_constexpr" === cmd)
    return {
      category: "cpp",
      interactive: false,
      text: i18n('insert "constexpr "'),
      shortcut: "¢"
    };
  if ("cpp_noexcept2" === cmd)
    return {
      category: "cpp",
      interactive: false,
      text: i18n('insert "noexcept(noexcept())"'),
      shortcut: "Shift+Ñ"
    };
  if ("cpp_const" === cmd)
    return {
      category: "cpp",
      interactive: false,
      text: i18n('insert "const "'),
      shortcut: "©"
    };
  if ("cpp_template" === cmd)
    return {
      category: "cpp",
      interactive: false,
      text: i18n('insert "template<class >"'),
      shortcut: "þ"
    };
  if ("cpp_struct" === cmd)
    return {
      category: "cpp",
      interactive: false,
      text: i18n('insert "struct "'),
      shortcut: "§"
    };
  if ("cpp_class" === cmd)
    return {
      category: "cpp",
      interactive: false,
      text: i18n('insert "class "'),
      shortcut: "ß"
    };
  if ("cpp_ref" === cmd)
    return {
      category: "cpp",
      interactive: false,
      text: i18n('insert " \\& "'),
      shortcut: "Shift+Ë"
    };
  if ("cpp_this" === cmd)
    return {
      category: "cpp",
      interactive: false,
      text: i18n('insert "this->"'),
      shortcut: "Ctrl+p"
    };
}


function help(cmd) {
  if ("cpp_noexcept" === cmd)
    return i18n('insert noexcept ');

  if ("cpp_const_ref" === cmd)
    return i18n('insert const & ');

  if ("cpp_constexpr" === cmd)
    return i18n('insert constexpr ');

  if ("cpp_noexcept2" === cmd)
    return i18n('insert noexcept(noexcept())');

  if ("cpp_const" === cmd)
    return i18n('insert const ');

  if ("cpp_template" === cmd)
    return i18n('insert template<class >');

  if ("cpp_struct" === cmd)
    return i18n('insert struct ');

  if ("cpp_class" === cmd)
    return i18n('insert class ');

  if ("cpp_ref" === cmd)
    return i18n('insert  & ');

  if ("cpp_this" === cmd)
    return i18n('insert this->');
}
