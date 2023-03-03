const katescript = {
  "author": "Jonathan Poelen <jonathan.poelen+katescript@gmail.com>",
  "license": "BSD",
  "revision": 2,
  "kate-version": "5.1",
  "functions": [ "alias", "createExpression", "createFunction", "execCmd" ]
};


require('jln/command.js')
// required if the created functions manipulate a Cursor or a Range
require('range.js')

const _functions = {}
const _aliases = {}
const slice = Array.prototype.slice;

function createFunction(name/*[arg1[, ... argN],] functionBody*/)
{
  _functions[name] = Function.call(...arguments);
}

function createExpression(name/*, functionBody*/)
{
  const args = [...arguments];
  args[0] = ''
  _functions[name] = Function(args.join(' '));
}

function execCmd(name/*[, arg1[, ... argN]]*/)
{
  const fn = _aliases[name] || _functions[name];
  if (fn) return fn.call(...arguments);
  executeCommand(prepareCommand(name, arguments, arguments.length - 1));
}

function alias(name, cmdname, /*args...*/)
{
  if (cmdname === undefined) {
    delete _aliases[name];
    return;
  }

  const p = (name[0] === ':');
  name = p ? name.substr(1) : name;
  const fn = _functions[cmdname];

  // functions
  if (fn) {
    const args = slice.apply(null, arguments, 2);
    _aliases[name] = function() {
      return fn.apply(null, p ? [...arguments].concat(args) : args.concat(arguments));
    };
  }

  // command line (prepend params)
  else if (p) {
    cmdname += ' ';
    const args = ' ' + prepareArguments(arguments, arguments.length - 2, 2);
    _aliases[name] = function() {
      const len = arguments.length;
      executeCommand((len === 0)
        ? cmdname + args
        : cmdname + prepareArguments(arguments, len) + args
      );
    };
  }

  // command line (append params)
  else {
    const cmd = prepareCommand(cmdname, arguments, arguments.length - 2, 2) + ' ';
    _aliases[name] = function() {
      const len = arguments.length;
      executeCommand((len === 0)
        ? cmd
        : cmd + prepareArguments(arguments, len)
      );
    };
  }
}


function help(cmd)
{
  if (cmd === "alias")
    return i18n("Créer un alias sur commandReference et ajoute à chaque appel les arguments avant ceux passés à la fonction aliasée.. Si la première lettre de name est ':' alors les arguments sont ajoutés après ceux passés à la fonction aliasée.\
<br/><br/>alias(name: String", +"[params: mixed, …]\", commandReference: String)");

  if (cmd === "createFunction")
    return i18n("Créer une fonction qui pourra être executée avec execCmd ou via les commandes demandant des fonctions.\
<br/><br/>createFunction(name: String", +"[params: mixed, …]\", body: JSCode\
)");

  if (cmd === "execCmd")
    return i18n("Exécute une commande créée par createFunction ou alias.\
<br/><br/>execCmd(name: String", +"[params: mixed, …]\")");
}
