require("cursor-utils.js")
require("removeThenInsertText.js")

/*
 * Exécute func sur un tableau de lignes défait de leur "\n"
 */
function each(func)
{
  if (typeof(func) !== "function") {
    debug("parameter is not a function: " + typeof(func));
    return;
  }
  var selection = getSelectionBlock(),
  lines = func(document.text(selection).split("\n"));
  removeRangeThenInsertText(selection, lines.join ? lines.join("\n") : lines);
}

