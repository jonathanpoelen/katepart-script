require("toBoolean.js")

function getName(name, noExt)
{
  return (toBoolean(noExt) && -1 !== (noExt = name.lastIndexOf('.'))) ?
    name.substr(0, noExt) :
    name;
}
