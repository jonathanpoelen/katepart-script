function isSpace(c)
{
  return c === ' ' || c === '\t';
}

function isBlank(c)
{
  return c === ' ' || c === '\t' || c === '\n';
}

String.prototype.reverse = function(limit)
{
  return this.split('', limit).reverse().join('');
};

String.prototype.interpret = function(){
  interpretStr(this);
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
};
