#!/bin/bash

[ $# -ne 1 ] && echo $0 command-file >&2 && exit 1

functions=`sed -E '/^ \* functions:/!d;s/^ \* functions:(.*)/\1/' "$@" | sed ':a;N;s/\n/,/;ta;'`
functions="${functions// /}"

actions="$(sed -E '/^function action/,/^}/!d;
/^function/d;/^}/d;
/^\{/d;
/return \{|icon: ""/d;
s/if \(["'\''](.*)["'\''].*/{ "function": "\1",/g;
s/category: ""/"category": "Editing"/g;
s/category: /"category": /g;
s/interactive: /"interactive": /g;
s/text: i18n\("(.*)"\)/"name": "\1"/g;
s/text: i18n\('\''(.*)'\''\)/"name": "\1"/g;
s/shortcut: /"shortcut": /g;
s/};/},/g' "$@")"

echo 'var katescript = {
    "author": "Jonathan Poelen <jonathan.poelen+katescript@gmail.com>",
    "license": "LGPL",
    "revision": '$(sed '/revision/{!d;s/ *\* *revision: //;q};d' "$@")',
    "kate-version": "5.1",
    "functions": ["'${functions//,/\", \"}'"]'
    [ ! -z "$actions" ] && echo "    ,\"actions\": [${actions:0:-1}]"
echo '};'

sed '1,/\*\//{d;q};/^function action/,/^}/d;' "$@"
