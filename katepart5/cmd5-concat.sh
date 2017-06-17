#!/bin/bash

d=$(dirname "$0")
typeset -i revision=$(cat "$d"/revision.txt 2> /dev/null)
((++revision))
echo $revision > "$d"/revision.txt

# var katescript = ...
"$d"/header5-extractor.lua $revision "$@"
ret=$?
[ $ret -ne 0 ] && exit $ret
echo

# require(...)...
sed -E '
  /^require\(/!d
  s/^require\(["'\'']([^"]+)['\''"]\).*/\1/
' "$@" | sort -u | xargs -d'\n' printf "require('%s')\n"

# contents without katescript, require(...) and help function
sed -E '/^var katescript/,/^}/d;/^require\(/d;/^function +help *\(/,/^}/d' "$@"

# help
echo 'function help(cmd){'
sed -E '/^function +help *\(/,/^}/!d;/^[^ \t]/d' "$@"
echo '}'
