#!/bin/sh
saxonb-xslt -a function-help.xml \
| sed -e :a -e N -e '$!ba' \
	-e s'/\+\n\s*);/);/g' \
	-e s'/\+\n\s*\", \"\+/, /g' \
	-e s'/\",\s*+\s*\n\s*\"/, /g'
