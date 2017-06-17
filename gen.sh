#!/bin/sh

cd "$(dirname "$0")"

kjscmd -e -n ./generators/abbreviations5.js < ./abbreviations/cpp 2>/dev/null > katepart5/script/commands/cpp_abbrs.js
