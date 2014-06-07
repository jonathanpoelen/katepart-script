Object.firstValue = function(object){
  for (var name in object)
    return object[name];
};
