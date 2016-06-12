#!/bin/bash

[ $# == 0 ] && echo $0 command-file... >&2 && exit 1

p=`dirname $0`

libs=`sed -E '/^require/!d;/"range.js"|"cursor.js"/d;s/^require\("(.*)"\);?/\1/' "$@" | sort -u`

functions=`sed -E '/^ \* functions:/!d;s/^ \* functions:(.*)/\1/' "$@" | sed ':a;N;s/\n/, /;ta'`

if [ ! -z "$libs" ] ; then
  cd "$p"/libraries
  libs=`{ echo "$libs" ; sed -E '/^require/!d;/"range.js"|"cursor.js"/d;s/^require\("(.*)"\);?/\1/' $libs ; } | sort -u`
  [[ $libs=~'forEach\.js' ]] && contains_foreach=1
  [[ $libs=~'position\.js' ]] && contains_position=1
  ( [ ! -z "$contains_foreach" ] || [ ! -z "$contains_position" ] ) && libs=`{ [ ! -z "$contains_foreach" ] && echo 'forEach.js' ; [ ! -z "$contains_position" ] && echo 'position.js' ; grep -vE 'forEach\.js|position\.js' <<< "$libs" ; }`
  cd - > /dev/null
fi

typeset -i revision=$(cat "$p"/revision.txt 2> /dev/null)
echo $(( ++revision )) > "$p"/revision.txt

echo '/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: '$revision'
 * kate-version: 4
 * type: commands
 * functions: '$functions'
 */
require("range.js")

' ;
if [ ! -z "$libs" ] ; then
  cd "$p"/libraries ;
  grep -vh '^require' $libs ;
  cd - > /dev/null ;
fi
sed -s '1,/\*\//d;/^require/d;/^function action/,/^}/d;/^function help/,/^}/d' "$@" ;
echo 'function help(cmd){' ;
sed '/^function help/,/^}/!d;/^function/d;/^}/d;/^{/d' "$@" ;
echo '}

function action(cmd){' ;
sed '/^function action/,/^}/!d;/^function/d;/^}/d;/^{/d' "$@" ;
echo '}' ;
