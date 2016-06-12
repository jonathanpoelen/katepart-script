katepart-script
===============

These scripts adds more than one hundred new commands to the Kate Editor and derivatives (KWrite, KDevelop, Kile, etc).

By default, the shortcut to command line is `f7`.


Documentation
-------------

Open `./doc-script/functions-descriptions.xml` or `./doc-script/doc.html` with a browser (fr with examples) or used `help a_command` in the command line.


Install
-------

## KDE 5:

```sh
scriptdir="${XDG_DATA_HOME=~/.local/share}/katepart5/script/"
tmpdir="${TMPDIR=/tmp}/katepart-script-$$"
mkdir -p "$tmpdir/commands" "$scriptdir/commands" &&
cp -ri libraries/ "$scriptdir" &&
for f in commands/* ; do ./4to5.sh "$f" > "$tmpdir/$f" ; done &&
mv -i "$tmpdir/commands"/* "$scriptdir/commands"
```

Or merge commands into one file:

```sh
cd commands
jsfile="${TMPDIR=/tmp}"/katepartscript.kfs4.js
../build.sh *.js > "$jsfile" && \
../4to5.sh "$jsfile" > "${XDG_DATA_HOME=~/.local/share}"/katepart5/script/commands/katepartscript.kfs5.js
```

## KDE 4:

```sh
cp -ri libraries/ commands/ "${KDEHOME=~}"/.kde/share/apps/katepart/script/
```

Or merge commands into one file with `build.sh`:

```sh
cd commands
../build.sh *.js > "${KDEHOME=~}"/.kde/share/app/katepart/script/commands/katepartscript.kfs4.js
```
