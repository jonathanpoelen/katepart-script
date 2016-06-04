katepart-script
===============

These scripts adds more than one hundred new commands to the Kate Editor and derivatives (KWrite, KDevelop, Kile, etc).

By default, the shortcut to command line is `f7`.


Documentation
-------------

Open `./doc-script/doc.html` with a browser (fr with examples) or `help a_command` in the command line.


Install
-------

## KDE 5:

/!\ _ATTENTION_: headers files are incompatible. Use `build5.js` or see `help:/katepart/dev-scripting.html#dev-scripting-command-line`.

Copy `libraries/` and `commands/` in the local home folder $XDG_DATA_HOME/katepart5/script/. Therein, the environment variable XDG_DATA_HOME typically expands to either ~/.local or ~/.local/share

Or merge commands into one file with `build5.sh`:

```sh
cd commands
../build5.sh *.js > "$XDG_DATA_HOME"/katepart5/script/commands/katepartscript.kfs5.js
```

## KDE 4:

Copy the files inside `libraries/` in `$KDEHOME/.kde/share/apps/katepart/script/libraries` and `commands/` in `$KDEHOME/.kde/share/apps/katepart/script/commands`

Or merge commands into one file with `build.sh`:

```sh
cd commands
../build.sh *.js > "$KDEHOME"/.kde/share/app/katepart/script/commands/katepartscript.kfs4.js
```
