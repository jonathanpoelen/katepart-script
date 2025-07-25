#!/bin/bash
project_path=~/projects/kplugins/katepart-script
cd ~/projects/build/kps
ls -1 \
  "$project_path"/katepart5/script/commands/*.js \
  "$project_path"/katepart5/script/libraries/jln/*.js \
  "$project_path"/columnize.zsh \
  "$project_path"/test.sh \
  "$project_path"/tests/*cpp \
| entr -s 'ninja autotest && echo && set -o pipefail && XDG_DATA_DIRS='"$project_path"' timeout 2 ./autotest '"${*@Q}"' 2>&1 | sed /^kf/d\;s/$/$/\;s@'"$project_path"'/@@ | '"$project_path"'/columnize.zsh || { c=$? ; if (( $c == 124 )); then echo -e "\e[31mTimeout\e[m"; fi ; exit $c ; }'
