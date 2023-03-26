const katescript = {
  "author": "Jonathan Poelen <jonathan.poelen+katescript@gmail.com>",
  "license": "BSD",
  "revision": 1,
  "kate-version": "5.1",
  "functions": ["ints"]
};

require('jln/interpretStr.js')
require('jln/command.js')

const _intsPushRange = function(nums, start, end, step, inclusive)
{
  if (start > end)
    step = -step;

  if (inclusive)
    end += step;

  let nloop = (end - start) / step | 0;

  while (nloop--) {
    nums.push(start);
    start += step;
  }
};

const _intsPushLetterInts = function(nums, arg, ps, inclusive)
{
  let start = arg.charCodeAt();

  if (!start)
    return false;

  let end;
  let step = 1;
  arg = ps[1];
  if (arg !== undefined)
  {
    if (arg[0] === '!')
    {
      arg = arg.substr(1);
      inclusive = false;
    }
    end = arg.charCodeAt() | 0;
    step = Math.max(1, ps[2] | 0);
  }
  // lower (a-z)
  else if (97 <= start && start <= 122)
  {
    end = start;
    start = 97;
  }
  // upper (A-Z)
  else if (65 <= start && start <= 90)
  {
    end = start;
    start = 65;
  }
  else
    end = start;

  const len = nums.length;
  _intsPushRange(nums, start, end, step, inclusive);
  let i = nums.length;
  while (i-- > len)
    nums[i] = String.fromCharCode(nums[i]);

  return true;
};

const _intsCount0 = function(arg, i)
{
  const start = i;
  while (arg[i] === '0')
    ++i;
  return i - start;
}

const _intsPushDefaultInts = function(nums, arg, ps, inclusive)
{
  let start = arg | 0;

  // not range, is a command
  if (start === 0 && (arg ? isNaN(+arg) : (ps.length === 1)))
    return false;

  let outLen = 0;
  let radix = 10;
  let upperCase = false;
  let prefix = ''

  // is prefix format number (0x, 0b, 0o) or have 0 padding
  if (arg[0] === '0' && arg.length !== 1)
  {
    const upperArg = arg.toUpperCase();
    const c = upperArg[1];

    let inum = 2;
    if (c === 'X') { radix = 16; prefix = '0x'; }
    else if (c === 'B') { radix = 2; prefix = '0b'; }
    else if (c === 'O') { radix = 8; prefix = '0o'; }
    else inum = 0;

    upperCase = (inum === 2 && upperArg.substr(2) === arg.substr(2));

    if (arg[inum] === '0' && arg.length !== inum + 1)
      outLen = arg.length - inum;
  }
  else if (arg[0] === '-' && arg[1] === '0' && arg.length !== 2)
    outLen = arg.length;

  let end;
  let step = 1;
  arg = ps[1];
  if (arg !== undefined)
  {
    if (arg[0] === '!')
    {
      arg = arg.substr(1);
      inclusive = false;
    }

    end = ((/^0[xboXBO]/.test(arg)) ? arg : parseInt(arg, radix)) | 0;
    step = ps[2] | 0;
    if (step < 0)
    {
      [end, start] = [start, end];
      step = -step;
    }
    step = Math.max(1, step);
  }
  else
  {
    end = start;
    start = 0;
  }

  const len = nums.length;
  _intsPushRange(nums, start, end, step, inclusive);
  if (outLen > 1 || radix !== 10 || upperCase)
  {
    for (let i = nums.length; i-- > len;)
    {
      const n = nums[i];
      let neg = false;
      let s;

      if (outLen > 1)
      {
        neg = (n < 0);
        s = (neg ? -n : n).toString(radix);
        const diff = outLen - (s.length + neg);
        s = '0'.repeat(Math.max(0, diff)) + s;
      }
      else
        s = n.toString(radix);

      if (upperCase)
        s = s.toUpperCase();
      nums[i] = prefix + (neg ? '-' + s : s);
    }
  }

  return true;
};

const _intsEscapeChar = function(n, xEscape, upper)
{
  if (n < 32)
  {
    let e;
    if (xEscape)
    {
      if (n === 7) return '\\a';
      if (n === 8) return '\\b';
      if (n === 9) return '\\t';
      if (n === 10) return '\\n';
      if (n === 11) return '\\v';
      if (n === 12) return '\\f';
      if (n === 13) return '\\r';
      e = (n <= 0xF) ? '\\x0' : '\\x';
    }
    else
      e = (n <= 0xF) ? '0x0' : '0x';
    const s = n.toString(16);
    return e + (upper ? s.toUpperCase() : s);
  }
  if (n === 134) return xEscape ? '\\\\' : (upper ? '0x5C' : '0x5c');
  if (n === 127) return xEscape ? (upper ? '\\x7F' : '\\x7f') : (upper ? '0x7F' : '0x7f');
  return String.fromCharCode(n);
}

const _intsPushStr = function(parts, s)
{
  const prev = parts[parts.length - 1];
  if (prev && prev[0] === 0)
    prev[1] += s;
  else
    parts.push([0, s]);
}

const _intsFormated = function(nums, arg, ps, ic)
{
  let inclusive = true;
  if (arg[ic] === '!')
  {
    inclusive = false;
    ++ic;
  }

  let radix = -1;
  let i = arg.indexOf('%', ic);
  if (i === -1)
  {
    arg = arg.substr(ic);
    return _intsPushDefaultInts(nums, arg, ps, inclusive)
        || _intsPushLetterInts(nums, arg, ps, inclusive);
  }

  radix = arg.substring(ic, i) | 0 || undefined;

  const parts = [];

  if (arg[i+1] === '%')
  {
    i += 2;

    let istr = i;

    while (i < arg.length)
    {
      let c = arg[i];

      if (c === '%')
      {
        if (arg[i+1] === '%')
        {
          _intsPushStr(parts, arg.substring(istr, i + 1));
          i += 2;
          istr = i;
          continue;
        }
        break;
      }

      if (c === '{')
      {
        if (arg[i+1] === '{')
        {
          _intsPushStr(parts, arg.substring(istr, i + 1));
          i += 2;
          istr = i;
          continue;
        }

        if (istr !== i)
          _intsPushStr(parts, arg.substring(istr, i));

        const iend = arg.indexOf('}', i);

        if (iend === i+1)
        {
          parts.push([1, radix]);
          i += 2;
        }
        else
        {
          let outradix = radix;
          let outLen = 0;
          let pad0 = false;
          let dir = 1;
          let sign = false;
          let upper = false;

          c = arg[++i];

          for (;;)
          {
            if (c == '0')
            {
              pad0 = true;
              c = arg[++i];
            }
            else if (c == '<')
            {
              dir = -1;
              c = arg[++i];
            }
            else if (c == '>')
              c = arg[++i];
            else if (c == '=')
            {
              dir = 0;
              c = arg[++i];
            }
            else if (c == '^')
            {
              dir = 2;
              c = arg[++i];
            }
            else if (c == '+')
            {
              sign = true;
              c = arg[++i];
            }
            else if (c == 'u')
            {
              upper = true;
              c = arg[++i];
            }
            else
              break;
          }

          // TODO ascii format (lower / upper) / escaped ascii format

          let iradix = arg.indexOf('@', i);
          if (iradix !== -1)
          {
            if (iradix < iend)
            {
              const newradix = arg.substring(iradix + 1, iend);
              outradix = parseInt(newradix) | 0;
              if (outradix <= 0)
              {
                const c = newradix[0];
                if (c === 'a')
                  outradix = -1;
                else if (c === 'l')
                {
                  outradix = -2;
                  upper = false;
                }
                else if (c === 'e')
                  outradix = -3;
                else if (c === 'x')
                  outradix = -4;
                else
                  outradix = radix;
              }
            }
          }
          else
            iradix = iend;

          upper = (outradix > 10 || outradix < 0) && upper;
          outLen = arg.substring(i, iradix) | 0;
          if (outLen <= 1)
            parts.push([1, outradix, sign, upper]);
          else
            parts.push([2, outradix, sign, upper, outLen, pad0, dir]);
          i = iend + 1;
        }

        istr = i;
      }
      else
        ++i;
    }

    if (istr !== i)
      _intsPushStr(parts, arg.substring(istr, i));
  }

  let start = parseInt(arg.substr(i+1), radix);

  let step = 1;
  arg = ps[1];
  if (arg !== undefined)
  {
    if (arg[0] === '!')
    {
      arg = arg.substr(1);
      inclusive = false;
    }
    end = parseInt(arg, radix) | 0;
    step = Math.max(1, ps[2] | 0);
  }
  else
  {
    end = start;
    start = 0;
  }

  const len = nums.length;
  _intsPushRange(nums, start, end, step, inclusive);

  if (parts.length)
  {
    const strLen = parts.length;
    const strs = Array(strLen);
    for (let i = nums.length; i-- > len;)
    {
      for (let j = 0; j < strLen; ++j)
      {
        const part = parts[j];
        const type = part[0];
        if (type === 0)
          strs[j] = part[1];
        else
        {
          const n = nums[i];
          const neg = (n < 0);
          const sign = part[2];
          const radix = part[1];
          let upper = part[3];

          let s = (!radix || radix >= 0)
            ? n.toString(radix)
            : (radix === -1)
            ? String.fromCharCode(n+97)
            : (radix === -2)
            ? String.fromCharCode(n)
            : _intsEscapeChar(n, radix === -4, upper ? ((upper = false), true) : false)
            ;

          if (upper)
            s = s.toUpperCase();

          if (sign && !neg)
            s = '+' + s;

          if (type === 2)
          {
            const outLen = part[4];
            const diff = outLen - s.length;
            if (diff > 0)
            {
              const pad0 = part[5]
              const dir = part[6]
              const pad = (pad0 ? '0' : ' ');
              if (dir === -1)
                s += pad.repeat(diff);
              else
              {
                if (pad0 && (sign || neg))
                  s = s.substr(1);

                if (dir === 1)
                  s = pad.repeat(diff) + s;
                else
                {
                  const d = (dir == 0) ? 0 : 1;
                  s = pad.repeat(((diff+d) / 2) | 0) + s + pad.repeat(((diff+(1-d)) / 2) | 0);
                }

                if (pad0 && (sign || neg))
                  s = (n < 0 ? '-' : '+') + s;
              }
            }
          }

          strs[j] = s;
        }
      }
      nums[i] = strs.join('');
    }
  }
  else if (radix !== 10)
  {
    for (let i = nums.length; i-- > len;)
      nums[i] = nums[i].toString(radix);
  }
};

function ints(/*...range, ...cmd*/)
{
  const argLen = arguments.length;
  const nums = [];
  let iarg = 0;
  for (; iarg < argLen; ++iarg)
  {
    const ps = arguments[iarg].split(',');
    let arg0 = ps[0];

    if (arg0[0] === '%')
      _intsFormated(nums, arg0, ps, 1);
    else if (arg0[0] === 'i' && arg0[1] === '%')
      _intsFormated(nums, interpretStr(arg0), ps, 2);
    else
    {
      let inclusive = true;
      if (arg0[0] === '!')
      {
        arg0 = arg0.substr(1);
        inclusive = false;
      }

      if (!_intsPushDefaultInts(nums, arg0, ps, inclusive)
       && (iarg !== 0 || !_intsPushLetterInts(nums, arg0, ps, inclusive)))
          break;
    }
  }

  if (iarg === argLen || arguments[iarg] === '')
  {
    let sep = arguments[iarg + 1]
    if (sep === undefined)
      sep = ', ';
    document.insertText(view.cursorPosition(), nums.join(sep));
  }
  else
  {
    const numLen = nums.length;
    const remainingArg = argLen - iarg;
    const cmd = Array(numLen + remainingArg);
    cmd[0] = arguments[iarg];
    copyPreparedArguments(cmd, remainingArg - 1, 1, arguments, iarg + 1);
    copyPreparedAnyArguments(cmd, numLen, remainingArg, nums, 0);
    executeCommand(cmd.join(' '));
  }
}


function help(cmd)
{
  if (cmd === "ints")
    return i18n("Generate integer sequences and add them to command parameters.\
<br/><br/>ints(...ints: Range, command: String = '', ...commandParams\")\
<br/>When command is empty, sequences are displayed at cursor position with ', ' as separator or the first parameter of commandParams.\
<br/><br/>BNF format for Range:\
<br/>range ::= (fmtOpt | '%')? (exclusiveFlag? end | start ',' exclusiveFlag? end (',' step)?)\
<br/>start ::= Number\
<br/>end ::= Number\
<br/>step ::= Number\
<br/>exclusiveFlag ::= '!'\
<br/>fmtOpt ::= inFormat outFormat?\
<br/>informat ::= '%' radix? '%'\
<br/>radix ::= Number\
<br/>outformat ::= interpretStringFlag? '%' ('%%' | '{{' | '{' intFormat '}' | .) '%'\
<br/>interpretStringFlag ::= 'i'\
<br/>intFormat ::= (pad0 | align | upper)* outLen? ('@' (radix | otherFormat))?\
<br/>pad0 ::= '0'\
<br/>align ::= '<' | '>' | '=' | '^'\
<br/>upper ::= 'u'\
<br/>outLen ::= Number\
<br/>otherFormat ::= 'a' | 'l' | 'e' | 'x'\
<br/><br/>\
<br/>When start is not specified, it is implicitly 0.\
<br/>When start or end is a letter, it refers to the ascii character in the range a-z or A-Z.\
<br/>If there are 0s at the beginning of start and fmtOpt is not specified, the number sequence will also be padded with 0s.\
<br/>otherFormat\
<br/>  - 'a': range in a-z\
<br/>  - 'l': utf-16 character\
<br/>  - 'e': escaped ascii char (0x0a, a)\
<br/>  - 'x': escaped ascii char (\\t, \\x00, a)\
<br/><br/>Example:\
<br/>`ints 0xA,0xC`: 0xA, 0xB, 0xC\
<br/>`ints 9,11`: 9, 10, 11\
<br/>`ints 09,11`: 09, 10, 11\
<br/>`ints 11,9`: 11, 10, 0\
<br/>`ints b %c %!c`: a, b, a, b, c, a, b\
<br/>`ints ints %20%aj,b3`: aj, b0, b1, b2, b3\
<br/>`ints %%%{0+3}%-2,2`: -02, -01, +00, +01, +02\
<br/>`ints \"%%%'{@l}'%56,61\"`: '8', '9', ':', ';', '<', '='\
<br/>$ ints %%%|{@a}|{u@a}|{<4@a}|{>4@a}|{=4@a}|{^4@a}|%0,1\
<br/>|a|A|a   |   a| a  |  a |, |b|B|b   |   b| b  |  b |");
}
