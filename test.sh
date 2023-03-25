#!/bin/bash
cd ~/projects/build/kps
ls -1 \
  ~/projects/kplugins/katepart-script/katepart5/script/commands/*.js \
  ~/projects/kplugins/katepart-script/katepart5/script/libraries/jln/*.js \
  ~/projects/kplugins/katepart-script/{columnize,test}.sh \
  ~/projects/kplugins/katepart-script/tests/*cpp \
| entr -s 'ninja autotest && echo && set -o pipefail && XDG_DATA_DIRS=/home/jonathan/projects/kplugins/katepart-script timeout 2 ./autotest '"${*@Q}"' 2>&1 | sed /^kf/d\;s/$/$/\;s@/home/jonathan/projects/kplugins/katepart-script/@@ | ~/projects/kplugins/katepart-script/columnize.sh || { c=$? ; if (( $c == 124 )); then echo -e "\e[31mTimeout\e[m"; fi ; exit $c ; }'
