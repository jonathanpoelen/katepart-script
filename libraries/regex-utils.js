//http://sugarjs.com
RegExp.escape = function(str){
  return str.replace(/([/'*+?|()\[\]{}.^$])/g,'\\$1');
}
