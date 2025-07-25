#!/bin/zsh

LINES+=-2

contents=$(<&0)

lines=("${(@f)contents}")

sanitized_lines=("${(@f)$(sed -E 's/\x1b[^m]+m//g' <<<$contents)}")

declare -i maxlen=0;
for l in $sanitized_lines; do
  if ((maxlen < $#l)); then
    maxlen=$#l
  fi
done

declare -i nbcol=COLUMNS/maxlen
if ((nbcol*maxlen + (nbcol-1)*3 > COLUMNS)); then
  ((--nbcol))
fi

if ((nbcol <= 1)); then
  <<<$contents
  exit;
fi

declare -i nbline=$#lines+nbcol-1/nbcol
if ((nbline > $LINES)); then
  nbline=$LINES
fi

if (($#lines <= nbline)); then
  <<<$contents
  exit;
fi

declare -i c j ii
for ((i=0; i<nbline; ++i)); do
  ii=-nbline+i
  echo -En $lines[ii]
  for ((j=2; j<=nbcol; ++j)); do
    c=maxlen-$#sanitized_lines[ii]
    ii+=-nbline
    if ((-ii<0)); then
      break;
    fi
    if ((c > 0)); then
      echo -En $'\x1b['$c'C'
    fi
    echo -En $' \x1b[43m \x1b[m '$lines[ii]
  done
  echo
done
