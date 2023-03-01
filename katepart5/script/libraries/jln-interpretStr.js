const _interpretStrReplace = function(s) {
  switch (s) {
    case '\\\\': return '\\';
    case '\\t': return '\t';
    case '\\n': return '\n';
  }
  return s;
};

enableInterpretStr = true;

function interpretStr(str)
{
  return enableInterpretStr ? str.replace(/\\./g, _interpretStrReplace) : str;
}
