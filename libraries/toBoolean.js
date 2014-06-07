String.yesWords = ["true", "yes", "y", "on", "oui", "o"];

String.prototype.isYes = function(){
  return -1 !== String.yesWords.indexOf(""+this);
};

Boolean.prototype.toBoolean = function(){
  return this;
};

String.prototype.toBoolean = function(){
  return Boolean(+this) || this.isYes();
};

Number.prototype.toBoolean = function(){
  return Boolean(this);
};

function toBoolean(v)
{
  return v && v.toBoolean ? v.toBoolean() : false;
}
