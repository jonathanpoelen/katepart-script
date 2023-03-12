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
    "dashedCaseToSnakeCase",
    "reverseCase"
  ]
};

require("jln/selectionOrLineProcess.js")
require("jln/unicodeRegexCategories.js")
require("jln/boundsSearchRegex.js")

const letters = unicodeLetterRegexCategory; // \p{L}
const digits = unicodeNumberRegexCategory; // \p{N}
const upper = unicodeUppercaseLetterRegexCategory; // \p{Lu}

const _caseTransform = function(extractWordRegex, replacement)
{
  if (view.hasSelection())
  {
    selectionProcess(true, function(text) {
      return text.replace(extractWordRegex, replacement)
    });
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

const _camelCaseWordReplace = function(word, pattern) {
  let first = true;
  return word.replace(pattern, function(match, c1, c2) {
    if (first)
    {
      first = false;
      return c2 === undefined ? match.toLowerCase() : c2.toUpperCase();
    }
    return (c1 !== undefined ? c1
          : c2 !== undefined ? c2
          : match).toUpperCase();
  });
};

const _camelUpperCaseWordReplace = function(word, pattern) {
  return word.replace(pattern, function(match, c1, c2) {
    return (c1 !== undefined ? c1
          : c2 !== undefined ? c2
          : match).toUpperCase();
  });
}

let _camelCasePatternExtractor;
let _camelCasePattern;
const _camelCase = function(wordReplace)
{
  if (!_camelCasePatternExtractor) {
    _camelCasePatternExtractor = RegExp(
      `(_*)([_${letters}${digits}]+)`, 'g'
    );
    _camelCasePattern = RegExp(
      `_+?([^_${digits}]|(?!_|$))|([${digits}]+[^_${digits}])|^.`, 'g'
    );
  }

  _caseTransform(_camelCasePatternExtractor, function(_, prefix, word) {
    return prefix + wordReplace(word, _camelCasePattern);
  });
}


// TODO generic replacement (sep=_ letters= digits=)
// TODO version qui comme les précédentes, mais prend aussi - dans le pattern

function camelCase()
{
  // x1y -> x1Y
  // _1x1y -> _1X1Y
  // xxx_yyy -> xxxYyy
  // _xxx_yyy -> _xxxYyy
  // xxx_yyy_ -> xxxYyy_
  _camelCase(_camelCaseWordReplace);
}

function camelUpperCase()
{
  // xxx_yyy -> XxxYyy
  // __xxx_yyy -> __XxxYyy
  _camelCase(_camelUpperCaseWordReplace);
}


let _snakeCasePattern;
const _snakeCase = function(replacementRegex, separator)
{
  separator = separator || '_';

  _snakeCasePattern = _snakeCasePattern || RegExp(
    `[_${letters}${digits}]+`, 'g'
  );

  _caseTransform(_snakeCasePattern, function(word) {
    return word.replace(replacementRegex, function(match, part) {
      return (part === undefined)
        ? separator + match.toLowerCase()
        : part.toLowerCase();
    });
  });
}

let _snakeCasePatternIgnoreDigit;
function snakeCase(separator)
{
  _snakeCasePatternIgnoreDigit = _snakeCasePatternIgnoreDigit || RegExp(
    `([_${digits}][${upper}]|^.)|[${upper}]`, 'g'
  );
  _snakeCase(_snakeCasePatternIgnoreDigit, separator);
}

let _snakeCasePatternWrapDigitRight;
this['snakeCase/d_'] = function(separator) {
  _snakeCasePatternWrapDigitRight = _snakeCasePatternWrapDigitRight || RegExp(
    `(_[${upper}]|^.)|[${upper}]`, 'g'
  );
  _snakeCase(_snakeCasePatternWrapDigitRight, separator);
}

let _snakeCasePatternWrapDigitLeft;
this['snakeCase/_d'] = function(separator) {
  _snakeCasePatternWrapDigitLeft = _snakeCasePatternWrapDigitLeft || RegExp(
    `(_[${upper}]|_[${digits}]+[${upper}]?|^[${digits}]*.)|[${upper}]|[${digits}]+[^_]?`, 'g'
  );
  _snakeCase(_snakeCasePatternWrapDigitLeft, separator);
}

let _snakeCasePatternWrapDigit;
this['snakeCase/_d_'] = function(separator) {
  _snakeCasePatternWrapDigit = _snakeCasePatternWrapDigit || RegExp(
    `(_[${upper}]|_[${digits}]+|^[${digits}]+|^.)|[${upper}]|[${digits}]+`, 'g'
  );
  _snakeCase(_snakeCasePatternWrapDigit, separator);
}


let _dashedCasePatternExtractor;
let _dashedCaseToCamelCasePattern;
const _dashedCaseToCamelCase = function(wordReplace)
{
  if (!_dashedCasePatternExtractor) {
    _dashedCasePatternExtractor = RegExp(
      `([-_]*)([-_${letters}${digits}]+)`, 'g'
    );
    _dashedCaseToCamelCasePattern = RegExp(
      `[-_]+?([^-_${digits}]|(?![-_]|$))|([${digits}]+[^-_${digits}])|^.`, 'g'
    );
  }

  _caseTransform(_dashedCasePatternExtractor, function(_, prefix, word) {
    if (/[^-_]/.test(word)) {
      word = wordReplace(word, _dashedCaseToCamelCasePattern);
      return (prefix + word).replace(/-/g, '_');
    }
    return prefix + word;
  });
}

function dashedCaseToCamelCase()
{
  // x1y -> x1Y
  // -1x1y -> _1X1Y
  // xxx-yyy -> xxxYyy
  // -xxx-yyy -> _xxxYyy
  // xxx-yyy- -> xxxYyy_
  _dashedCaseToCamelCase(_camelCaseWordReplace);
}

function dashedCaseToCamelUpperCase()
{
  // xxx-yyy -> XxxYyy
  // --xxx-yyy -> __XxxYyy
  _dashedCaseToCamelCase(_camelUpperCaseWordReplace);
}


let _dashedCaseToSnakeCasePatternExtractor;
function dashedCaseToSnakeCase(separator)
{
  separator = separator || '_';

  _dashedCaseToSnakeCasePatternExtractor = _dashedCaseToSnakeCasePatternExtractor || RegExp(
    `[-_${letters}${digits}]+`, 'g'
  );

  _caseTransform(_dashedCaseToSnakeCasePatternExtractor, function(word) {
    return /[^-_]/.test(word) ? word.replace(/-/g, separator) : word;
  });
}


let _reverseCasePatternExtractor;
function reverseCase()
{
  _reverseCasePatternExtractor = _reverseCasePatternExtractor || RegExp(
    `[_${letters}${digits}]+`, 'g'
  );

  _caseTransform(_reverseCasePatternExtractor, function(word) {
    const len = word.length;
    const a = Array(len);
    for (let i = 0; i !== len; ++i){
      const c1 = word[i];
      const c2 = c1.toUpperCase();
      a[i] = (c1 === c2) ? c1.toLowerCase() : c2;
    }
    return a.join('');
  });
}


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
