require("insertion.js")

function show()
{
  insertText(Array.join.call(arguments, ",") + "\n");
}
