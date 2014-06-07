var window = this;

var functions = [];

function getCommandOrThrowError(name)
{
  var command = window[name] || functions[name];
  if (!command)
  {
    command = name.split(".");
    if (command[1] && (command[0] = window[command[0]])
      && (command = command[0][command[1]]))
      return command;
    //debug(name + " is not a command");
    throw ReferenceError(name + ": command not found");
  }
  return command;
}
