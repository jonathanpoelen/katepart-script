cmake_minimum_required(VERSION 3.16)

project(KatePartScript VERSION "1.0.0")

set(CXX_STANDARD 20)

find_package(KF5TextEditor REQUIRED)
set(CMAKE_COLOR_DIAGNOSTICS ON)

add_executable(autotest
  tests/main.cpp
  tests/transposeCharacter.cpp
  tests/transposeAtSeparator.cpp
  tests/tr.cpp
  tests/count.cpp
)
target_link_libraries(autotest KF5::TextEditor)

enable_testing()
add_test(NAME jstest COMMAND $<TARGET_FILE:autotest>)
set_property(TEST jstest
             PROPERTY ENVIRONMENT XDG_DATA_DIRS=${PROJECT_SOURCE_DIR})
