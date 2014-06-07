require("cursor.js")

function simpleLeftAlgorithm(fn, args)
{
  var column;
  fn(args, function(cursor){
    column = document.lineLength(cursor.line) - cursor.column;
  }, function(cursor){
    cursor.column = document.lineLength(cursor.line) - column;
  });
}
