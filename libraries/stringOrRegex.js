require("regex-utils.js")

var _stringOrRegex = function(str, flag) {
  if (flag === "g") {
    return new RegExp(RegExp.escape(str), "g");
  }
  return str;
}

var _regexOrString = function(str, flag) {
  return new RegExp(str, flag);
}

var stringOrRegex = _stringOrRegex;
var regexOrString = _regexOrString;
