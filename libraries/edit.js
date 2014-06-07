require("text.js")
require("cursor.js")

function edit(fn, args, thisp)
{
  /*if (typeof fn !== "function")
   *    throw Error("not function");*/
  document.editBegin();
  try
  {
    return fn.apply(thisp||fn, args);
  }
  finally
  {
    document.editEnd();
  }
}

function editText(args, fn, removeSelection/*, thisp*/)
{
  return edit(text, [args, fn, removeSelection]/*, thisp*/);
}
