/// Search a word at a specific position.
/// \code
///   reg: /\w+/g
///   text: "abc abc abc"
///   index:      ^
///   match:     \_/
/// \endcode
/// \important re should be a global regex
/// \return undefined | {index: Number, match: String}
/// \note word found can be start after index
function boundsSearchRegex(text, re, index)
{
  do {
    if (text[--index] === undefined) {
      break;
    }
    re.lastIndex = 0;
  } while (re.test(text[index]));
  ++index;

  re.lastIndex = index;

  const m = re.exec(text);
  if (m === undefined) {
    return undefined;
  }

  const word = m[0];
  if (word === undefined) {
    return undefined;
  }

  return {index: re.lastIndex - word.length, match: word};
}
