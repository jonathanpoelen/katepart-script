#!/bin/bash

[ $# == 0 ] && echo $0 command-file... >&2 && exit 1

p=`dirname $0`

libs=`sed -E '/^require/!d;/"range.js"|"cursor.js"/d;s/^require\("(.*)"\);?/\1/' "$@" | sort -u`

functions=`sed -E '/^ \* functions:/!d;s/^ \* functions:(.*)/\1/' "$@" | sed :a';/$/N;s/\n/, /;ta'`
functions="${functions// /}"

if [ ! -z "$libs" ] ; then
  cd "$p"/libraries
  libs=`{ echo "$libs" ; sed -E '/^require/!d;/"range.js"|"cursor.js"/d;s/^require\("(.*)"\);?/\1/' $libs ; } | sort -u`
  [[ $libs=~'forEach\.js' ]] && contains_foreach=1
  [[ $libs=~'position\.js' ]] && contains_position=1
  ( [ ! -z "$contains_foreach" ] || [ ! -z "$contains_position" ] ) && libs=`{ [ ! -z "$contains_foreach" ] && echo 'forEach.js' ; [ ! -z "$contains_position" ] && echo 'position.js' ; grep -vE 'forEach\.js|position\.js' <<< "$libs" ; }`
  cd - > /dev/null
fi

actions="$(sed -E '/^function action/,/^}/!d;
/^function/d;/^}/d;
/^\{/d;
/return \{|icon: ""/d;
s/if \("(.*)".*/{ "function": "\1",/g;
s/category: ""/"category": "Editing"/g;
s/interactive: (.*),/"interactive": "\1",/g;
s/text: i18n\("(.*)"\)/"name": "\1"/g;
s/shortcut: /"shortcut": /g;
s/};/},/g' "$@")"

typeset -i revision=$(cat "$p"/revision.txt 2> /dev/null)
echo $(( ++revision )) > "$p"/revision.txt

{ echo 'var katescript = {
    "author": "Jonathan Poelen <jonathan.poelen+katescript@gmail.com>",
    "license": "LGPL",
    "revision": '$revision',
    "kate-version": "5.1",
    "functions": ["'${functions//,/\", \"}'"]'
 [ ! -z "$actions" ] && echo "    ,\"actions\": [${actions:0:-1}]"
echo '};

require("range.js")

' ;\
 cd "$p"/libraries ;\
 grep -vh '^require' $libs ;\
 cd - > /dev/null ;\
 sed '/^\/\*/d;/^ \*/d;/^require/d;/^function action/,/^}/d;/^function help/,/^}/d' "$@" ;\
 echo 'function help(cmd){' ;\
 sed '/^function help/,/^}/!d;/^function/d;/^}/d;/^{/d' "$@" ;\
 echo '}' ;\
} > "$p"/pwaipwai-utils-ks5.js
