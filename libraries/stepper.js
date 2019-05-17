require("array-utils.js")

/*{first:Number, modulo:Number}||null*/
function stepper(step)
{
  step = step || "";
  var index = step.indexOf('~');
  step = -1 === index ? null : {
    first: +step.substring(0, index) || 0,
    modulo: +step.substr(index + 1) || 0
  };
  return step && step.modulo ? step : null;
}


function Stepper(s, position)
{
  var options = '', first = 0, step_ = 1, n = +s, isRelative = false, d;
  if (isNaN(n) && ((isRelative = s[0] === '!')
    ? isNaN(n = +(s = s.substr(('+' === (d = s[1]) || '-' === d) ? 2 : 1))) : 1))
  {
    step_ = s.indexOf("~");
    if (step_ !== -1)
    {
      first = Math.abs(s.substring(0, step_)) || 0;
      s = s.substr(step_ + 1);
      step_ = s.match(/\d+/);
      s = s.substr(step_.length);
      if (s)
      {
        step_ = +step_ || 1;
        first %= step_;
        n = +s;
      }
      else
      {
        n = step_;
        step_ = first || 1;
        first = 0;
      }
    }
    else
    {
      var indexOfNonDigit = s.search(/[^-\d]/);
      step_ = +s.substr(0, indexOfNonDigit);
      s = s.substr(indexOfNonDigit);
      if (!s)
      {
        n = step_;
        step_ = 1;
      }
      else
      {
        if (!step_)
          step_ = 1;
        n = NaN;
      }
    }

    if (isNaN(n))
    {
      for (var i = 0; i < s.length; ++i)
      {
        if ((/[-\d]/).test(s[i]))
        {
          s = s.substr(i);
          break;
        }
        else
          options += s[i];
      }
      n = +s || (document.lines() - 1);
    }
  }
  if (isRelative)
    n = '+' === d ? n + position : '-' === d ? n - position : n < position ? -(position - n + 2) : (n - position);

  var isNegative_ = n < 0;
  if (isNegative_)
    n = -n;

  return {
    isNegative: function(){
      // QTBUG-75880: can not be the name of the key
      return isNegative_;
    },
    get value(){
      return n;
    },
    get step(){
      // QTBUG-75880: can not be the name of the key
      return step_;
    },
    onStep: function(n){
      return n % step_ === first;
    },
    valid: function(){
      return n > 0;
    },
    next: function(){
      --n;
    },
    hasOption: function(option){
      return -1 !== options.indexOf(option)
    }
  };
}
