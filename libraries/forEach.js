function forEach(object, callback, thisp){
  for (var name in object)
    callback.call(thisp || object[name], object[name], name, object);
  return object;
}
