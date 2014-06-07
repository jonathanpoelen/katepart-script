Array.map = Array.prototype.map;
Array.join = Array.prototype.join;
Array.slice = Array.prototype.slice;
Array.reduce = Array.prototype.reduce;
// Array.push = Array.prototype.push;
// Array.forEach = Array.prototype.forEach;

function $A(args, begin, end){
  return Array.slice.call(args, begin, end);
}

function $M(args, func){
  return Array.map.call(args, func);
}

/*ajoute également dans l'itérateur (for in) :/
Array.prototype.uniq = function(){};*/
Array.uniq = function(array){
  return Array.isArray(array) ?
  array.reduce(function(accu, v){
    if (-1 === accu.indexOf(v))
      accu.push(v);
    return accu;
  }, []) :
  [array];
};

// Array.make = function(array, range, accu, fn, thisp){
//  var slice = Array.isArray(range) ?
//    Array.slice.apply(array, range) :
//    Array.slice.call(array, range);
//
//  if ("function" === typeof accu)
//  {
//    thisp = fn;
//    fn = accu;
//    accu = null;
//  }
//  else if ("function" !== typeof fn)
//    fn = null;
//
//  if (fn)
//    for (var i in slice)
//      slice[i] = fn.call(thisp || slice[i], slice[i], k, slice);
//
//  return accu ? accu.concat(slice) : slice;
// };

Array.concatEnd = function(a, o){
  length = a.length;
  if (length)
  {
    a[length - 1] += o;
    return length;
  }
  else
    return a.push(o);
};

Array.linear = function(array, accu){
  accu = accu || [];
  array.forEach(function(value){
    if (Array.isArray(value))
      Array.linear(value, accu);
    else
      accu.push(value);
  });
  return accu;
};
