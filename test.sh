#!/bin/bash
cd ~/projects/build/kps
ls -1 \
  ~/projects/kplugins/katepart-script/katepart5/script/commands/*.js \
  ~/projects/kplugins/katepart-script/katepart5/script/libraries/jln/*.js \
  ~/projects/kplugins/katepart-script/tests/*cpp \
| entr -s 'ninja autotest&& XDG_DATA_DIRS=/home/jonathan/projects/kplugins/katepart-script timeout 3 ./autotest '"${*@Q}"' 2>&1 | sed s/$/$/\;/^kf/d'
