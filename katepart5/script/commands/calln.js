const katescript = {
  "author": "Jonathan Poelen <jonathan.poelen+katescript@gmail.com>",
  "license": "BSD",
  "revision": 1,
  "kate-version": "5.1",
  "functions": [ "calln", "callns" ]
};

require("jln/command.js")


const _executeCommands = function(repeat, commands, icommand)
{
  document.editBegin();
  repeat = parseInt(repeat) & 0xffff;
  for (let i = 0; i < repeat; ++i) {
    for (let j = icommand; j < commands.length; ++j) {
      executeCommand(commands[j]);
    }
  }
  document.editEnd();
}

function calln(repeat/*, cmd...*/)
{
  _executeCommands(repeat, arguments, 1);
}

function callns(repeat, delim/*, cmdname, args...*/)
{
  const commands = [];

  let start = 2;
  let i = 2;
  for (; i < arguments.length; ++i)
  {
    if (arguments[i] === delim)
    {
      if (start < i)
        commands.push(prepareCommand(arguments[start], arguments, i - (start + 1), start + 1));
      start = i + 1;
    }
  }

  if (start < arguments.length)
    commands.push(prepareCommand(arguments[start], arguments, i - (start + 1), start + 1));

  _executeCommands(repeat, commands, 0);
}


function help(cmd)
{
  if (cmd === "calln")
    return i18n("Repeats commands several times.\
<br/><br/>calln(repeat: Number, ...command: String)\
<br/><br/>Example:\
<br/>line${cursor}\
<br/>$ calln 2 duplicateLinesUp duplicateLinesDown\
<br/>line\
<br/>line\
<br/>line${cursor}\
<br/>line\
<br/>line");

  if (cmd === "callns")
    return i18n("Repeats commands several times.\
<br/><br/>callns(repeat: Number, delimiter: String, ...commandFragment: String)\
<br/><br/>Example:\
<br/>line${cursor}\
<br/>$ callns 2 ; duplicateLinesUp ; duplicateLinesDown\
<br/>line\
<br/>line\
<br/>line${cursor}\
<br/>line\
<br/>line");
}
