require("string-utils.js")

var interpretStrIsActiv = true;
var interpretStr = function(str){
  return "string" === typeof str ? interpretStrIsActiv ? str.interpret() : str : "";
};
