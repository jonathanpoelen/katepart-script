const katescript = {
  "author": "Jonathan Poelen <jonathan.poelen+katescript@gmail.com>",
  "license": "BSD",
  "revision": 2,
  "kate-version": "5.1",
  "functions": [
    "camelCase",
    "camelUpperCase",
    "snakeCase",
    "dashedCase",
    "dashedCaseToCamelCase",
    "dashedCaseToCamelUpperCase",
    "dashedCaseToSnakeCase"
  ]
};

require("jln/selectionOrLineProcess.js")
require("jln/unicodeRegexCategories.js")
require("jln/boundsSearchRegex.js")

const _caseTransform = function(extractWordRegex, replacement)
{
  if (view.hasSelection())
  {
    selectionProcess(true, (text) => text.replace(extractWordRegex, replacement));
  }
  else
  {
    const cursor = view.cursorPosition();
    const line = cursor.line;
    const m = boundsSearchRegex(document.line(line), extractWordRegex, cursor.column);
    if (!m)
      return;
    const oldText = m.match;
    const newText = oldText.replace(extractWordRegex, replacement);
    const column = m.index;

    document.editBegin();
    document.removeText(line, column, line, column + oldText.length);
    document.insertText(line, column, newText);
    view.setCursorPosition(line, column + newText.length);
    document.editEnd();
  }
};

const letters = unicodeLetterRegexCategory;
const digits = unicodeNumberRegexCategory;

const _camelCaseRegexExtractor = RegExp(
  `(_*)([_${letters}${digits}]+)`, 'g'
);

const _camelCaseRegexReplacement = RegExp(
  `_+?([^_${digits}]|(?!_|$))|([${digits}]+[^_${digits}])|^.`, 'g'
);

// TODO add ignore prefix (set-ignore-prefix)
// TODO generic replacement (sep=_ letters= digits=)

function camelCase()
{
  // x1y -> x1Y
  // _1x1y -> _1X1Y
  // xxx_yyy -> xxxYyy
  // _xxx_yyy -> _xxxYyy
  // xxx_yyy_ -> xxxYyy_
  _caseTransform(_camelCaseRegexExtractor, function(_, prefix, word) {
    let first = true;
    return prefix + word.replace(_camelCaseRegexReplacement, (match, c1, c2) => {
      if (first)
      {
        first = false;
        return c2 === undefined ? match.toLowerCase() : c2.toUpperCase();
      }
      return (c1 !== undefined ? c1
            : c2 !== undefined ? c2
            : match).toUpperCase();
    });
  });
}

function camelUpperCase()
{
  // xxx_yyy -> XxxYyy
  // __xxx_yyy -> __XxxYyy
  _caseTransform(_camelCaseRegexExtractor, function(_, prefix, word) {
    return prefix + word.replace(_camelCaseRegexReplacement, (match, c1, c2) => {
      return (c1 !== undefined ? c1
            : c2 !== undefined ? c2
            : match).toUpperCase();
    });
  });
}

const upper = unicodeUppercaseLetterRegexCategory;

const _snakeCaseRegexExtractor = RegExp(
  `[_${letters}${digits}]+`, 'g'
);

const _snakeCaseRegexReplacementWrapDigit = RegExp(
  `(_[${upper}]|_[${digits}]+|^[${digits}]+|^.)|[${upper}]|[${digits}]+`, 'g'
);

const _snakeCaseRegexReplacementIgnoreDigit = RegExp(
  `([_${digits}][${upper}]|^.)|[${upper}]`, 'g'
);

const _snakeCaseRegexReplacementWrapDigitRight = RegExp(
  `(_[${upper}]|^.)|[${upper}]`, 'g'
);

const _snakeCaseRegexReplacementWrapDigitLeft = RegExp(
  `(_[${upper}]|_[${digits}]+[${upper}]?|^[${digits}]*.)|[${upper}]|[${digits}]+[^_]?`, 'g'
);

const _snakeCase = function(extractorRegex, replacementRegex, separator)
{
  _caseTransform(extractorRegex, function(word) {
    return word.replace(replacementRegex, (match, part) => {
      return (part === undefined)
        ? separator + match.toLowerCase()
        : part.toLowerCase();
    });
  });
}

function snakeCase(separator)
{
  _snakeCase(_snakeCaseRegexExtractor, _snakeCaseRegexReplacementIgnoreDigit, separator || '_');
}

this['snakeCase/d_'] = function(separator) {
  _snakeCase(_snakeCaseRegexExtractor, _snakeCaseRegexReplacementWrapDigitRight, separator || '_');
}

this['snakeCase/_d'] = function(separator) {
  _snakeCase(_snakeCaseRegexExtractor, _snakeCaseRegexReplacementWrapDigitLeft, separator || '_');
}

this['snakeCase/_d_'] = function(separator) {
  _snakeCase(_snakeCaseRegexExtractor, _snakeCaseRegexReplacementWrapDigit, separator || '_');
}


const _dashedCaseRegexExtractor = RegExp(
  `([-_]*)([-_${letters}${digits}]+)`, 'g'
);

const _dashedCaseToCamelCaseRegexReplacement = RegExp(
  `[-_]+?([^-_${digits}]|(?![-_]|$))|([${digits}]+[^-_${digits}])|^.`, 'g'
);

function dashedCaseToCamelCase()
{
  // x1y -> x1Y
  // -1x1y -> _1X1Y
  // xxx-yyy -> xxxYyy
  // -xxx-yyy -> _xxxYyy
  // xxx-yyy- -> xxxYyy_
  _caseTransform(_dashedCaseRegexExtractor, function(_, prefix, word) {
    if (!/[^-_]/.test(word))
      return prefix + word;

    let first = true;
    return (prefix + word.replace(_dashedCaseToCamelCaseRegexReplacement, (match, c1, c2) => {
      if (first)
      {
        first = false;
        return c2 === undefined ? match.toLowerCase() : c2.toUpperCase();
      }
      return (c1 !== undefined ? c1
            : c2 !== undefined ? c2
            : match).toUpperCase();
    })).replace(/-/g, '_');
  });
}

function dashedCaseToCamelUpperCase()
{
  // xxx-yyy -> XxxYyy
  // --xxx-yyy -> __XxxYyy
  _caseTransform(_dashedCaseRegexExtractor, function(_, prefix, word) {
    if (!/[^-_]/.test(word))
      return prefix + word;

    return (prefix + word.replace(_dashedCaseToCamelCaseRegexReplacement, (match, c1, c2) => {
      return (c1 !== undefined ? c1
            : c2 !== undefined ? c2
            : match).toUpperCase();
    })).replace(/-/g, '_');
  });
}

const _dashedCaseToSnakeCaseRegexExtractor = RegExp(
  `[-_${letters}${digits}]+`, 'g'
);

function dashedCaseToSnakeCase(separator)
{
  separator = separator || '_';
  _caseTransform(_dashedCaseToSnakeCaseRegexExtractor, function(word) {
    if (!/[^-_]/.test(word))
      return word;
    return word.replace(/-/g, separator);
  });
}

// TODO version qui comme les précédentes, mais prend aussi - dans le pattern

//
// function reverseCase()
// {
//   var selection = selectionOrLine(false);
//   var s = "", t = selection.text, len = t.length, c;
//   for (var i = 0; i !== len; ++i){
//     c = t[i].toUpperCase();
//     s += c == t[i] ? t[i].toLowerCase() : c;
//   }
//   removeRangeThenInsertText(selection.range, s);
// }


function help(cmd)
{
  if (cmd === "camelCase")
    return i18n("Transforme la ligne ou de la sélection en camelCase, les tirets ou underscore suivit d'un caractère alpanumérique sont remplacé par un ça majuscule.\
<br/><br/>camelCase(ignoreC: String= undefined)\
<br/>ignoreC: Prend comme valeur - ou _.");

  if (cmd === "capitalize")
    return i18n("Met les premières lettre de chaque mot de la ligne ou de la sélection en majuscule.\
<br/><br/>capitalize(rgx= /(^[\\x7E-\\xFFA-Za-z])|[^\\x7E-\\xFFA-Za-z\\d]([\\x7E-\\xFFA-Za-z])/g, isMinimal= false)\
<br/>rgx: RegExp pour capturer les lettres à mettre en majuscule.\
<br/>isMinimal: Si true alors rgx = \"(^[\\rgx+\"])|[^\\rgx+\"]([\\rgx+\"])\"");

  if (cmd === "dashedCase")
    return i18n("Met les lettre de la ligne ou de la sélection en minuscule précédé d'un tiret.\
<br/><br/>dashedCase()");

  if (cmd === "reverseCase")
    return i18n("Intervertit majuscule/minuscule.\
<br/><br/>reverseCase()");

  if (cmd === "underscoreCase")
    return i18n("Met les lettre de la ligne ou de la sélection en minuscule précédé d'un underscore.\
<br/><br/>underscoreCase()");
}
