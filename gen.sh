#!/bin/sh

cd "$(dirname "$0")"

./generators/abbreviations5.js abbreviations/cpp > katepart5/script/commands/cpp_abbrs.js
