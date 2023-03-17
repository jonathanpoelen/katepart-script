const katescript = {
  "author": "Jonathan Poelen <jonathan.poelen+katescript@gmail.com>",
  "license": "BSD",
  "revision": 2,
  "kate-version": "5.1",
  "functions": [
    "camelCase",
    "camelCase-",
    "pascalCase",
    "pascalCase-",
    "snakeCase",
    "snakeCase/d_",
    "snakeCase/_d",
    "snakeCase/_d_",
    "snakeCase-",
    "snakeCase-/d_",
    "snakeCase-/_d",
    "snakeCase-/_d_",
    "dashedCase",
    "dashedCaseToCamelCase",
    "dashedCaseToPascalCase",
    "dashedCaseToSnakeCase",
    "reverseCase",
    "reverseCase-"
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

const _pascalCaseWordReplace = function(word, pattern) {
  return word.replace(pattern, function(match, c1, c2) {
    return (c1 !== undefined ? c1
          : c2 !== undefined ? c2
          : match).toUpperCase();
  });
}

let _camelPatternExtractor;
let _camelPattern;
const _camelCase = function(wordReplace)
{
  if (!_camelPatternExtractor) {
    _camelPatternExtractor = RegExp(
      `(_*)([_${letters}${digits}]+)`, 'g'
    );
    // x1y -> X1Y
    // _1x1y -> _1X1Y
    // xxx_yyy -> XxxYyy
    // _xxx_yyy -> _XxxYyy
    // xxx_yyy_ -> XxxYyy_
    _camelPattern = RegExp(
      // _ followed with letter ; exclude end _ ; digits followed with letter ; first char
      `_+?([^_${digits}]|(?!_|$))|([${digits}]+[^_${digits}])|^.`, 'g'
    );
  }

  _caseTransform(_camelPatternExtractor, function(_, prefix, word) {
    return prefix + wordReplace(word, _camelPattern);
  });
}

function camelCase()
{
  _camelCase(_camelCaseWordReplace);
}

function pascalCase()
{
  _camelCase(_pascalCaseWordReplace);
}


let _camelPatternExtractor2;
let _camelPattern2;
const _camelCase2 = function(wordReplace)
{
  if (!_camelPatternExtractor2) {
    _camelPatternExtractor2 = RegExp(
      `([-_]*)([-_${letters}${digits}]+)`, 'g'
    );
    _camelPattern2 = RegExp(
      `[-_]+?([^-_${digits}]|(?![-_]|$))|([${digits}]+[^-_${digits}])|^.`, 'g'
    );
  }

  _caseTransform(_camelPatternExtractor2, function(_, prefix, word) {
    return (prefix + wordReplace(word, _camelPattern2)).replace(/-/g, '_');
  });
}

this['camelCase-'] = function()
{
  _camelCase2(_camelCaseWordReplace);
}

this['pascalCase-'] = function()
{
  _camelCase2(_pascalCaseWordReplace);
}


const _snakeCase = function(extractorPattern, replacementPattern, underscore, resultTransform)
{
  _caseTransform(extractorPattern, function(word) {
    word = word.replace(replacementPattern, function(match, part) {
      return (part === undefined)
        ? underscore + match.toLowerCase()
        : part.toLowerCase();
    });
    return resultTransform ? resultTransform(word, underscore) : word;
  });
}

let _snakeCasePattern;
const _makeSnakePattern = function()
{
  return _snakeCasePattern || (_snakeCasePattern = RegExp(
    `[_${letters}${digits}]+`, 'g'
  ));
}

let _snakeCasePatternIgnoreDigit;
const _makeSnakePatternIgnoreDigit = function() {
  return _snakeCasePatternIgnoreDigit || (_snakeCasePatternIgnoreDigit = RegExp(
    `([_${digits}][${upper}]|^.)|[${upper}]`, 'g'
  ));
}

let _snakeCasePatternWrapDigitRight;
const _makeSnakePatternWrapDigitRight = function() {
  return _snakeCasePatternWrapDigitRight || (_snakeCasePatternWrapDigitRight = RegExp(
    `(_[${upper}]|^.)|[${upper}]`, 'g'
  ));
}

let _snakeCasePatternWrapDigitLeft;
const _makeSnakePatternWrapDigitLeft = function() {
  return _snakeCasePatternWrapDigitLeft || (_snakeCasePatternWrapDigitLeft = RegExp(
    `(_[${upper}]|_[${digits}]+[${upper}]?|^[${digits}]*.)|[${upper}]|[${digits}]+[^_]?`, 'g'
  ));
}

let _snakeCasePatternWrapDigit;
const _makeSnakePatternWrapDigit = function() {
  return _snakeCasePatternWrapDigit || (_snakeCasePatternWrapDigit = RegExp(
    `(_[${upper}]|_[${digits}]+|^[${digits}]+|^.)|[${upper}]|[${digits}]+`, 'g'
  ));
}

const _replaceUndescore = function(word, c) {
  return word.replace(/_/g, c);
}

function snakeCase(underscore)
{
  if (underscore) {
    _snakeCase(_makeSnakePattern(), _makeSnakePatternIgnoreDigit(), underscore, _replaceUndescore);
  }
  else {
    _snakeCase(_makeSnakePattern(), _makeSnakePatternIgnoreDigit(), '_');
  }
}

this['snakeCase/d_'] = function(underscore)
{
  if (underscore) {
    _snakeCase(_makeSnakePattern(), _makeSnakePatternWrapDigitRight(), underscore, _replaceUndescore);
  }
  else {
    _snakeCase(_makeSnakePattern(), _makeSnakePatternWrapDigitRight(), '_');
  }
}

this['snakeCase/_d'] = function(underscore)
{
  if (underscore) {
    _snakeCase(_makeSnakePattern(), _makeSnakePatternWrapDigitLeft(), underscore, _replaceUndescore);
  }
  else {
    _snakeCase(_makeSnakePattern(), _makeSnakePatternWrapDigitLeft(), '_');
  }
}

this['snakeCase/_d_'] = function(underscore)
{
  if (underscore) {
    _snakeCase(_makeSnakePattern(), _makeSnakePatternWrapDigit(), underscore, _replaceUndescore);
  }
  else {
    _snakeCase(_makeSnakePattern(), _makeSnakePatternWrapDigit(), '_');
  }
}


let _snakeCasePattern2;
const _makeSnakePattern2 = function()
{
  return _snakeCasePattern2 || (_snakeCasePattern2 = RegExp(
    `[-_${letters}${digits}]+`, 'g'
  ));
}

let _snakeCasePatternIgnoreDigit2;
const _makeSnakePatternIgnoreDigit2 = function() {
  return _snakeCasePatternIgnoreDigit2 || (_snakeCasePatternIgnoreDigit2 = RegExp(
    `([-_${digits}][${upper}]|^.)|[${upper}]`, 'g'
  ));
}

let _snakeCasePatternWrapDigitRight2;
const _makeSnakePatternWrapDigitRight2 = function() {
  return _snakeCasePatternWrapDigitRight2 || (_snakeCasePatternWrapDigitRight2 = RegExp(
    `([-_][${upper}]|^.)|[${upper}]`, 'g'
  ));
}

let _snakeCasePatternWrapDigitLeft2;
const _makeSnakePatternWrapDigitLeft2 = function() {
  return _snakeCasePatternWrapDigitLeft2 || (_snakeCasePatternWrapDigitLeft2 = RegExp(
    `([-_][${upper}]|[-_][${digits}]+[${upper}]?|^[${digits}]*.)|[${upper}]|[${digits}]+[^-_]?`, 'g'
  ));
}

let _snakeCasePatternWrapDigit2;
const _makeSnakePatternWrapDigit2 = function() {
  return _snakeCasePatternWrapDigit2 || (_snakeCasePatternWrapDigit2 = RegExp(
    `([-_][${upper}]|[-_][${digits}]+|^[${digits}]+|^.)|[${upper}]|[${digits}]+`, 'g'
  ));
}

const _replaceDash = function(word) {
  return word.replace(/-/g, '_');
}

const _replaceUndescore2 = function(word, c) {
  return word.replace(/-/g, '_').replace(/_/g, c);
}

this['snakeCase-'] = function(underscore)
{
  if (underscore) {
    _snakeCase(_makeSnakePattern2(), _makeSnakePatternIgnoreDigit2(), underscore, _replaceUndescore2);
  }
  else {
    _snakeCase(_makeSnakePattern2(), _makeSnakePatternIgnoreDigit2(), '_', _replaceDash);
  }
}

this['snakeCase-/d_'] = function(underscore)
{
  if (underscore) {
    _snakeCase(_makeSnakePattern2(), _makeSnakePatternWrapDigitRight2(), underscore, _replaceUndescore2);
  }
  else {
    _snakeCase(_makeSnakePattern2(), _makeSnakePatternWrapDigitRight2(), '_', _replaceDash);
  }
}

this['snakeCase-/_d'] = function(underscore)
{
  if (underscore) {
    _snakeCase(_makeSnakePattern2(), _makeSnakePatternWrapDigitLeft2(), underscore, _replaceUndescore2);
  }
  else {
    _snakeCase(_makeSnakePattern2(), _makeSnakePatternWrapDigitLeft2(), '_', _replaceDash);
  }
}

this['snakeCase-/_d_'] = function(underscore)
{
  if (underscore) {
    _snakeCase(_makeSnakePattern2(), _makeSnakePatternWrapDigit2(), underscore, _replaceUndescore2);
  }
  else {
    _snakeCase(_makeSnakePattern2(), _makeSnakePatternWrapDigit2(), '_', _replaceDash);
  }
}


function dashedCase() {
  _snakeCase(_makeSnakePattern(), _makeSnakePatternIgnoreDigit(), '-', _replaceUndescore);
}

this['dashedCase/d_'] = function() {
  _snakeCase(_makeSnakePattern(), _makeSnakePatternWrapDigitRight(), '-', _replaceUndescore);
}

this['dashedCase/_d'] = function() {
  _snakeCase(_makeSnakePattern(), _makeSnakePatternWrapDigitLeft(), '-', _replaceUndescore);
}

this['dashedCase/_d_'] = function() {
  _snakeCase(_makeSnakePattern(), _makeSnakePatternWrapDigit(), '-', _replaceUndescore);
}


let _dashedPatternExtractor;
let _dashedToCamelPattern;
const _dashedCaseToCamelCase = function(wordReplace)
{
  if (!_dashedPatternExtractor) {
    _dashedPatternExtractor = RegExp(
      `([-_]*)([-_${letters}${digits}]+)`, 'g'
    );
    _dashedToCamelPattern = RegExp(
      `[-_]+?([^-_${digits}]|(?![-_]|$))|([${digits}]+[^-_${digits}])|^.`, 'g'
    );
  }

  _caseTransform(_dashedPatternExtractor, function(_, prefix, word) {
    if (/[^-_]/.test(word)) {
      word = wordReplace(word, _dashedToCamelPattern);
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

function dashedCaseToPascalCase()
{
  // xxx-yyy -> XxxYyy
  // --xxx-yyy -> __XxxYyy
  _dashedCaseToCamelCase(_pascalCaseWordReplace);
}


let _dashedCaseToSnakePatternExtractor;
function dashedCaseToSnakeCase(underscore)
{
  underscore = underscore || '_';

  _dashedCaseToSnakePatternExtractor = _dashedCaseToSnakePatternExtractor || RegExp(
    `[-_${letters}${digits}]+`, 'g'
  );

  _caseTransform(_dashedCaseToSnakePatternExtractor, function(word) {
    return /[^-_]/.test(word) ? word.replace(/-/g, underscore) : word;
  });
}


const _reverseTransform = function(word) {
  const len = word.length;
  const arr = Array(len);
  for (let i = 0; i !== len; ++i){
    const c1 = word[i];
    const c2 = c1.toUpperCase();
    arr[i] = (c1 === c2) ? c1.toLowerCase() : c2;
  }
  return arr.join('');
}

let _reverseCasePatternExtractor;
function reverseCase()
{
  _reverseCasePatternExtractor = _reverseCasePatternExtractor || RegExp(
    `[_${letters}${digits}]+`, 'g'
  );

  _caseTransform(_reverseCasePatternExtractor, _reverseTransform);
}

let _reverseCasePatternExtractor2;
this['reverseCase-'] = function()
{
  _reverseCasePatternExtractor2 = _reverseCasePatternExtractor2 || RegExp(
    `[-_${letters}${digits}]+`, 'g'
  );

  _caseTransform(_reverseCasePatternExtractor2, _reverseTransform);
}


function help(cmd)
{
  if (cmd === "camelCase")
    return i18n("Converts the selection or the identifier under the cursor to camelCase.\
<br/>An identifier is a sequence of letters, digits and _");

  if (cmd === "camelCase-")
    return i18n("Converts the selection or the identifier under the cursor to camelCase.\
<br/>An identifier is a sequence of letters, digits, _ and -");

  if (cmd === "pascalCase")
    return i18n("Converts the selection or the identifier under the cursor to PascalCase.\
<br/>An identifier is a sequence of letters, digits and _");

  if (cmd === "pascalCase-")
    return i18n("Converts the selection or the identifier under the cursor to PascalCase.\
<br/>An identifier is a sequence of letters, digits, _ and -");

  if (cmd === "snakeCase")
    return i18n("Converts the selection or the identifier under the cursor to snake_case.\
<br/>An identifier is a sequence of letters, digits and _\
<br/>\
<br/>snakeCase do not add underscore around numbers.\
<br/>snakeCase/d_ adds an underscore after numbers.\
<br/>snakeCase/_d adds an underscore before numbers.\
<br/>snakeCase/_d_ adds an underscore around numbers.\
<br/><br/>snakeCase(underscore: String = '_')");

  if (cmd === "snakeCase/d_") return i18n("See snakeCase");
  if (cmd === "snakeCase/_d") return i18n("See snakeCase");
  if (cmd === "snakeCase/_d_") return i18n("See snakeCase");

  if (cmd === "snakeCase-")
    return i18n("Converts the selection or the identifier under the cursor to snake_case.\
<br/>An identifier is a sequence of letters, digits, _ and -\
<br/>\
<br/>snakeCase- do not add underscore around numbers.\
<br/>snakeCase-/d_ adds an underscore after numbers.\
<br/>snakeCase-/_d adds an underscore before numbers.\
<br/>snakeCase-/_d_ adds an underscore around numbers.\
<br/><br/>snakeCase-(underscore: String = '_')");

  if (cmd === "snakeCase-/d_") return i18n("See snakeCase-");
  if (cmd === "snakeCase-/_d") return i18n("See snakeCase-");
  if (cmd === "snakeCase-/_d_") return i18n("See snakeCase-");

  if (cmd === "dashedCase")
    return i18n("Converts the selection or the identifier under the cursor to dashed-case.\
<br/>An identifier is a sequence of letters, digits and _");

  if (cmd === "reverseCase")
    return i18n("Reverse upper and lower case of selection or the identifier under the cursor.\
<br/>An identifier is a sequence of letters, digits and _");

  if (cmd === "reverseCase-")
    return i18n("Reverse upper and lower case of selection or the identifier under the cursor.\
<br/>An identifier is a sequence of letters, digits, _ and -");

  if (cmd === "dashedCaseToCamelCase")
    return i18n("Converts the selection or the identifier under the cursor from dashed-case to camelCase.\
<br/>An identifier is a sequence of letters, digits, _ and -");

  if (cmd === "dashedCaseToPascalCase")
    return i18n("Converts the selection or the identifier under the cursor from dashed-case to pascalCase.\
<br/>An identifier is a sequence of letters, digits, _ and -");

  if (cmd === "dashedCaseToSnakeCase")
    return i18n("Converts the selection or the identifier under the cursor from dashed-case to snake-case.\
<br/>An identifier is a sequence of letters, digits, _ and -\
<br/><br/>dashedCaseToSnakeCase(underscore: String = '_')");
}
