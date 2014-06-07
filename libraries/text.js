require("interpretStr.js")
require("array-utils.js")
require("range.js")

function text(args, func, removeSelection/*, thisp*/)
{
  var selection = view.selection(), a = [];
  if (selection.isValid())
  {
    a.push(document.text(selection));
    if (removeSelection)
      view.removeSelectedText();
  }
  a.push.apply(a, $M(args, interpretStr));
  return func.apply(/*thisp||*/func, a);
}
