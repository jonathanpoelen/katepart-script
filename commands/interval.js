/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: interval, rgxinterval, intervalx, rgxintervalx
 */

require("getCommandOrThrowError.js")
require("interpretStr.js")
require("array-utils.js")
require("show-command.js")

function toString(val)
{ return val.toString(); }

function _nInterval(args, i, len, fn)
{
  var step, start, end, r, accu = [];
  fn = fn || toString;
  var rgxdigit = /^\d/;
  for (; i < len && (rgxdigit.test(args[i]) || "-" === args[i][0]); ++i)
  {
    if ((/-?\d+--?\d+/).test(args[i]))
    {
      start = args[i].split(/(-?\d+)-(-?\d+)/);
      end = +start[2];
      start = +start[1];
      step = rgxdigit.test(args[i+1]) && Math.floor(args[++i]) || 1;
    }
    else
    {
      start = +args[i];
      end = +args[++i];
      step = 1;
    }

    r = [];
    if (start > end) {
      for (; end <= start; start -= step)
        r.push(fn(start));
    }
    else {
      for (; start <= end; start += step)
        r.push(fn(start));
    }
    accu.push(r);
  }
  return [accu, i];
}


function _interval(start, end, command, args, fn)
{
  (command ? getCommandOrThrowError(command) : show)
  .apply(null, args.concat(_nInterval(arguments, 0, 2, fn)[0][0]));
}


function interval(start, end, command)
{
  _interval(start, end, command, $A(arguments, 3));
}


function rgxinterval(str, rgx, start, end, command)
{
  str = interpretStr(str);
  rgx = new RegExp(rgx, "g");
  _interval(start, end, command, $A(arguments, 5), function(i){
    return str.replace(rgx, i);
  });
}


function _intervalx(_args, i, fn)
{
  var info = _nInterval(_args, i||0, _args.length, fn);
  var command = (info[1] === _args.length) ? show
  : getCommandOrThrowError(_args[info[1]++]);
  var args = $A(_args, info[1]), len = 0, i, ii;
  for (i in info[0])
    len = Math.max(info[0][i].length, len);
  for (i = 0; i < len; ++i)
  {
    for (ii in info[0])
    {
      if (undefined !== info[0][ii][i])
        args.push(info[0][ii][i]);
    }
  }
  command.apply(null, args);
}


function intervalx(/*interval…, command, args…*/)
{
  _intervalx(arguments);
}


function rgxintervalx(str, rgx /*,interval…, command, args…*/)
{
  str = interpretStr(str);
  rgx = new RegExp(rgx, "g");
  _intervalx(arguments, 2, function(i){
    return str.replace(rgx, i);
  });
}

function help(cmd)
{
  if (cmd === "interval")
    return i18n("Exécute la fonction command en envoyant comme paramètre l'interval et après y avoir ajouté les paramètres supplémentaires.\
<br/><br/>interval(start: Number|String, end: Number, command: String= show, [params: mixed, …]\")\
<br/>start: Si start est de la forme n1-n2 alors end correspond à l'incrémentation utilisé pour aller de start à end et start = n1 et end = n2. n1 = 0 ; n2 = 1.\
<br/><br/>exemple:\
<br/>$ interval 0 4 replace \"a[i] = \" i\
<br/>a[0] = a[1] = a[2] = a[3] = a[4] = ");

  if (cmd === "intervalx")
    return i18n("Exécute la fonction command en envoyant comme paramètre le regroupement d'interval et après y avoir ajouté les paramètres supplémentaires. Le regroupement ce fait en prenant la premièer valeurs des intervalles, puis la seconde, etc.\
<br/><br/>intervalx([start, end]…: Number|String, command: String= show, [params: mixed, …]\")\
<br/>[start, end]…: Si start est de la forme n1-n2 alors end correspond à l'incrémentation utilisé pour aller de start à end et start = n1 et end = n2. n1 = 0 ; n2 = 1.\
<br/><br/>exemple:\
<br/>$ intervalx 1 3 5 7 replacex 'a[x] = y; ' 2 x y\
<br/>a[1] = 5; a[2] = 6; a[3] = 7; ");

  if (cmd === "rgxinterval")
    return i18n("Exécute la fonction command en envoyant comme paramètre l'intervalle et après y avoir ajouté les paramètres supplémentaires. Pour chaque intervalle les morceaux de str qui correspondent à regex sont remplacés par la valeur de l'intervalle.\
<br/><br/>rgxinterval(str: String, rgx: RegExp, start: Number|String, end: Number, command: String= show, [params: mixed, …]\")\
<br/><br/>exemple:\
<br/>$ rgxinterval \"si\" i 1 3 replace \"a[] = i;\\n\" i b c\
<br/>a[] = b;<br/>\
a[] = c;<br/>\
a[] = s1;<br/>\
a[] = s2;<br/>\
a[] = s3;");

  if (cmd === "rgxintervalx")
    return i18n("Exécute la fonction command en envoyant comme paramètre le regroupement d'interval et après y avoir ajouté les paramètres supplémentaires. Pour chaque intervalle les morceaux de str qui correspondent à regex sont remplacés par la valeur de l'intervalle. Le regroupement ce fait en prenant la premièer valeurs des intervalles, puis la seconde, etc.\
<br/><br/>rgxintervalx(str: String, rgx: RegExp, [start, end]…: Number|String, command: String= show, [params: mixed, …]\")\
<br/><br/>exemple:\
<br/>$ rgxintervalx \"si\" i 1 3 5 7 replacex \"a[x] = i;\\n\" 2 x i b c\
<br/>a[b] = c;<br/>\
a[1] = 5;<br/>\
a[2] = 6;<br/>\
a[3] = 7;");

}
