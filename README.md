katepart-script
===============

KTextEditor additional command line. Compatible with Kate, KWrite, KDevelop, etc.

Documentation
-------------

See `./doc-script/doc.html` (fr with examples)

Install
-------

KDE 4.10 and more:

Copy the files inside `libraries/` in `$KDEHOME/.kde/share/app/katepart/script/libraries` and `commands/` in `$KDEHOME/.kde/share/app/katepart/script/commands`

Or merge commands into one file with `build.sh`:

```sh
cd commands
../build.sh commands-file
cp ../pwaipwai.utils.js $KDEHOME/.kde/share/app/katepart/script/commands
```

Old version
----------

https://code.google.com/p/katepart-script/source/browse/#svn%2Ftrunk%2Ftag-1.0
