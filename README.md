katepart-script
===============

KTextEditor additional command line. Compatible with Kate, KWrite, KDevelop, etc.

Documentation
-------------

See `./doc-script/doc.html` (fr with examples)

Install
-------

## KDE 5:

Copy `libraries/` and `commands/` in the local home folder $XDG_DATA_HOME/katepart5/script/. Therein, the environment variable XDG_DATA_HOME typically expands to either ~/.local or ~/.local/share

ATTENTION: headers files are incompatible. See `help:/katepart/dev-scripting.html#dev-scripting-command-line`.


Or merge commands into one file with `build5.sh`:

```sh
cd commands
../build5.sh *.js > "$XDG_DATA_HOME"/katepart5/script/commands/katepartscript.kfs5.js
```

## KDE 4:

Copy the files inside `libraries/` in `$KDEHOME/.kde/share/app/katepart/script/libraries` and `commands/` in `$KDEHOME/.kde/share/app/katepart/script/commands`

Or merge commands into one file with `build.sh`:

```sh
cd commands
../build.sh *.js > "$KDEHOME"/.kde/share/app/katepart/script/commands/katepartscript.kfs4.js
```
