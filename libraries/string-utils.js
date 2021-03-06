String.prototype.interpret = function(){
  return this.replace(/\\*(?:\\).?/g, function(s){
    var index = s.lastIndexOf("\\"),
      c = s[s.length - 1];
    return "\\".repeat(Math.round(index / 2)) +
      ("\\" === c ? (index ? "" : "\\") : index & 1 ? c : "t" === c ? "\t" : "n" === c ? "\n" : c);
  });
};

String.prototype.repeat = function(n){
  if (n <= 0)
    return "";

  var s = ""+this;
  while (--n > 0)
    s += this;
  return s;
};

String.prototype.countLine = function(){
  return this.split("\n").length;
};

String.prototype.allIndexOf = function(str){
  var index = 0, allIndex = [];
  while (-1 !== (index = this.indexOf(str, index)))
  {
    allIndex.push(index);
    index += str.length;
  }
  return allIndex;
};

String.prototype.reverse = function(){
  return this.split("").reverse().join("");
};

String.prototype.firstIndexNonSpace = function(){
  return this.search(/[^\s]/);
};

String.prototype.lastIndexNonSpace = function(){
  return this.search(/\s+$/);
};

String.prototype.firstSpace = function(){
  return this.substr(0, this.firstIndexNonSpace());
};

String.prototype.lastSpace = function(){
  var index = this.lastIndexNonSpace();
  return index === -1 ? "" : this.substr(index);
};

String.prototype.isAlphanumeric = function(){
  return (/\w/).test(this);
};

String.prototype.eachLine = function(func, thisp){
  return this.split("\n").map(func, thisp).join("\n");
};

String.prototype.reverseWrap = function(){
  return this.replace(/\[|\]|\(|\)|{|}|<|>/g, function (str){
    return "][)(}{><"["[](){}<>".indexOf(str)];
  })
}
