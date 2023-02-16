let katescript = {
  "author": "Jonathan Poelen <jonathan.poelen+katescript@gmail.com>",
  "license": "BSD",
  "revision": 2,
  "kate-version": "5.1",
  "functions": ["cpp_noexcept", "cpp_noexcept2", "cpp_const_ref", "cpp_constexpr", "cpp_const", "cpp_template", "cpp_template2", "cpp_struct", "cpp_class", "cpp_ref", "cpp_this", "cpp_move", "cpp_forward", "cpp_nullptr", "cpp_set_default", "cpp_set_delete", "cpp_static", "cpp_typename", "cpp_type", "cpp_value", "cpp_for_range", "cpp_dec_type", "cpp_dec_value"],
  "actions": [
    {"function": "cpp_noexcept", "category": "cpp", "interactive": false, "name": "insert \" noexcept\"", "shortcut": "ñ"},
    {"function": "cpp_noexcept2", "category": "cpp", "interactive": false, "name": "insert \" noexcept(noexcept())\"", "shortcut": "Shift+Ñ"},
    {"function": "cpp_const_ref", "category": "cpp", "interactive": false, "name": "insert \" const \& \"", "shortcut": "ë"},
    {"function": "cpp_constexpr", "category": "cpp", "interactive": false, "name": "insert \"constexpr \"", "shortcut": "¢"},
    {"function": "cpp_const", "category": "cpp", "interactive": false, "name": "insert \" const \"", "shortcut": "©"},
    {"function": "cpp_template", "category": "cpp", "interactive": false, "name": "insert \"template<class >\"", "shortcut": "Shift+þ"},
    {"function": "cpp_template2", "category": "cpp", "interactive": false, "name": "insert \"template ", "shortcut": "ä"},
    {"function": "cpp_struct", "category": "cpp", "interactive": false, "name": "insert \"struct \"", "shortcut": "§"},
    {"function": "cpp_class", "category": "cpp", "interactive": false, "name": "insert \"class \"", "shortcut": "ß"},
    {"function": "cpp_ref", "category": "cpp", "interactive": false, "name": "insert \" \& \"", "shortcut": "Shift+Ë"},
    {"function": "cpp_this", "category": "cpp", "interactive": false, "name": "insert \"this->\"", "shortcut": "Ctrl+p"},
    {"function": "cpp_move", "category": "cpp", "interactive": false, "name": "insert \"std::move()\"", "shortcut": "¶"},
    {"function": "cpp_forward", "category": "cpp", "interactive": false, "name": "insert \"std::forward<>()\"", "shortcut": "¿"},
    {"function": "cpp_nullptr", "category": "cpp", "interactive": false, "name": "insert \"nullptr\"", "shortcut": "ú"},
    {"function": "cpp_set_default", "category": "cpp", "interactive": false, "name": "insert \" = default;\"", "shortcut": "×"},
    {"function": "cpp_set_delete", "category": "cpp", "interactive": false, "name": "insert \" = delete;\"", "shortcut": "ð"},
    {"function": "cpp_static", "category": "cpp", "interactive": false, "name": "insert \"static \"", "shortcut": "á"},
    {"function": "cpp_typename", "category": "cpp", "interactive": false, "name": "insert \"typename \"", "shortcut": "þ"},
    {"function": "cpp_type", "category": "cpp", "interactive": false, "name": "insert \"::type\"", "shortcut": "®"},
    {"function": "cpp_value", "category": "cpp", "interactive": false, "name": "insert \"::value\"", "shortcut": "Shift+®"},
    {"function": "cpp_for_range", "category": "cpp", "interactive": false, "name": "insert \"for (auto \&\& )\"", "shortcut": "å"},
    {"function": "cpp_dec_type", "category": "cpp", "interactive": false, "name": "insert \"using type = typename ;\"", "shortcut": "Ctrl+®"},
    {"function": "cpp_dec_value", "category": "cpp", "interactive": false, "name": "insert \"static constexpr  value = ;\"", "shortcut": "Ctrl+Shift+®"}
  ]
};

require('cursor.js')

function cpp_noexcept() {
  const c = view.cursorPosition();
  document.insertText(c, document.charAt(c) == ' ' ? 'noexcept' : ' noexcept')
}

function cpp_noexcept2() {
  const c = view.cursorPosition();
  const t = document.charAt(c) == ' ' ? 'noexcept(noexcept())' : ' noexcept(noexcept())'
  document.insertText(c, t)
  c.column += t.length - 2
  view.setCursorPosition(c)
}

function cpp_const_ref() {
  const c = view.cursorPosition();
  document.insertText(c, document.charAt(c) == ' ' ? 'const & ' : ' const & ')
}

function cpp_constexpr() {
  document.insertText(view.cursorPosition(), 'constexpr ')
}

function cpp_const() {
  const c = view.cursorPosition();
  document.insertText(c, document.charAt(c) == ' ' ? 'const ' : ' const ')
}

function cpp_template() {
  const c = view.cursorPosition();
  document.insertText(c, 'template<class >')
  c.column += 15
  view.setCursorPosition(c)
}

function cpp_template2() {
  const c = view.cursorPosition();
  document.insertText(c, 'template ')
  c.column += 9
  view.setCursorPosition(c)
}

function cpp_struct() {
  document.insertText(view.cursorPosition(), 'struct ')
}

function cpp_class() {
  document.insertText(view.cursorPosition(), 'class ')
}

function cpp_ref() {
  const c = view.cursorPosition();
  document.insertText(c, document.charAt(c) == ' ' ? '& ' : ' & ')
}

function cpp_this() {
  document.insertText(view.cursorPosition(), 'this->')
}

function cpp_move() {
  const c = view.cursorPosition();
  document.insertText(c, 'std::move()')
  c.column += 10
  view.setCursorPosition(c)
}

function cpp_forward() {
  const c = view.cursorPosition();
  document.insertText(c, 'std::forward<>()')
  c.column += 13
  view.setCursorPosition(c)
}

function cpp_nullptr() {
  document.insertText(view.cursorPosition(), 'nullptr')
}

function cpp_set_default() {
  const c = view.cursorPosition();
  document.insertText(c, document.charAt(c) == ' ' ? '= default;' : ' = default;')
}

function cpp_set_delete() {
  const c = view.cursorPosition();
  document.insertText(c, document.charAt(c) == ' ' ? '= delete;' : ' = delete;')
}

function cpp_static() {
  document.insertText(view.cursorPosition(), 'static ')
}

function cpp_typename() {
  document.insertText(view.cursorPosition(), 'typename ')
}

function cpp_type() {
  document.insertText(view.cursorPosition(), '::type')
}

function cpp_value() {
  document.insertText(view.cursorPosition(), '::value')
}

function cpp_for_range() {
  const c = view.cursorPosition();
  document.insertText(c, 'for (auto && )')
  c.column += 13
  view.setCursorPosition(c)
}

function cpp_dec_type() {
  const c = view.cursorPosition();
  document.insertText(c, 'using type = typename ;')
  c.column += 22
  view.setCursorPosition(c)
}

function cpp_dec_value() {
  const c = view.cursorPosition();
  const t = 'static constexpr '+document.line(c.line).trim()+' value = ;'
  document.insertText(c, t)
  c.column += t.length - 1
  view.setCursorPosition(c)
}

function help(cmd) {
  if (cmd === 'cpp_noexcept') return i18n('insert " noexcept"')
  if (cmd === 'cpp_noexcept2') return i18n('insert " noexcept(noexcept())"')
  if (cmd === 'cpp_const_ref') return i18n('insert " const & "')
  if (cmd === 'cpp_constexpr') return i18n('insert "constexpr "')
  if (cmd === 'cpp_const') return i18n('insert " const "')
  if (cmd === 'cpp_template') return i18n('insert "template<class >"')
  if (cmd === 'cpp_template2') return i18n('insert "template "')
  if (cmd === 'cpp_struct') return i18n('insert "struct "')
  if (cmd === 'cpp_class') return i18n('insert "class "')
  if (cmd === 'cpp_ref') return i18n('insert " & "')
  if (cmd === 'cpp_this') return i18n('insert "this->"')
  if (cmd === 'cpp_move') return i18n('insert "std::move()"')
  if (cmd === 'cpp_forward') return i18n('insert "std::forward<>()"')
  if (cmd === 'cpp_nullptr') return i18n('insert "nullptr"')
  if (cmd === 'cpp_set_default') return i18n('insert " = default;"')
  if (cmd === 'cpp_set_delete') return i18n('insert " = delete;"')
  if (cmd === 'cpp_static') return i18n('insert "static "')
  if (cmd === 'cpp_typename') return i18n('insert "typename "')
  if (cmd === 'cpp_type') return i18n('insert "::type"')
  if (cmd === 'cpp_value') return i18n('insert "::value"')
  if (cmd === 'cpp_for_range') return i18n('insert "for (auto && )"')
  if (cmd === 'cpp_dec_type') return i18n('insert "using type = typename ;"')
  if (cmd === 'cpp_dec_value') return i18n('insert "static constexpr  value = ;"')
}
