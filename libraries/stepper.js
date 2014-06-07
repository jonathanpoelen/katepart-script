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
  var options = [], first = 0, step = 1, n = +s, isRelative = false, d;
  if (isNaN(n) && ((isRelative = s[0] === '!')
    ? isNaN(n = +(s = s.substr(('+' === (d = s[1]) || '-' === d) ? 2 : 1))) : 1))
  {
    step = s.indexOf("~");
    if (step !== -1)
    {
      first = Math.abs(s.substring(0, step)) || 0;
      s = s.substr(step + 1);
      step = s.match(/\d+/);
      s = s.substr(step.length);
      if (s)
      {
        step = +step || 1;
        first %= step;
        n = +s;
      }
      else
      {
        n = step;
        step = first || 1;
        first = 0;
      }
    }
    else
    {
      var indexOfNonDigit = s.search(/[^-\d]/);
      step = +s.substr(0, indexOfNonDigit);
      s = s.substr(indexOfNonDigit);
      if (!s)
      {
        n = step;
        step = 1;
      }
      else
      {
        if (!step)
          step = 1;
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
          options.push(s[i]);
      }
      options = Array.uniq(options);
      n = +s || (document.lines() - 1);
    }
  }
  if (isRelative)
    n = '+' === d ? n + position : '-' === d ? n - position : n < position ? -(position - n + 2) : (n - position);

  var isNegative = n < 0;
  if (isNegative)
    n = -n;

  return {
    isNegative: function(){
      return isNegative;
    },
    get value(){
      return n;
    },
    get step(){
      return step;
    },
    onStep: function(n){
      return n % step === first;
    },
    valid: function(){
      return n > 0;
    },
    next: function(){
      --n;
    },
    options: function(option){
      return !option ?
        options :
        Array.isArray(option) ?
          option.every(function(op){
            return -1 !== options.indexOf(op);
          }) :
          -1 !== options.indexOf(option.toString());
    }
  };
}
