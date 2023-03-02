#!/bin/sh
sed '/add_executable/,/)/{/^test/d;r '<(find tests -mindepth 1 | sort)'
}' -i CMakeLists.txt
