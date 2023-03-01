// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
// '-' XXX is added to protect use with character classes
// example: RegExp('[' + RegExp.escape('a-c') + ']') => /[a\-c]/
RegExp.escape = function(str)
{
  return str.replace(/[-.*+?^${}()|[\]\\]/g, "\\$&");
}
