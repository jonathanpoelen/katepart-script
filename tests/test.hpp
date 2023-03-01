/*
    SPDX-FileCopyrightText: 2023 Jonathan Poelen <jonathan.poelen+katescript@gmail.com>

    SPDX-License-Identifier: MIT
*/

#pragma once

struct UnitTest
{
  UnitTest(char const* name, void (*fn)());

  void (*fn)();
  char const* name;
  UnitTest* next;
};

struct TestCase {
  char const* filename;
  char const* line;
  struct Rng {
    char open;
    char close;
  };
  char const* cmd;
  char const* input;
  char const* expected;
  char cursor = '|';
  Rng range = {};
};

void check(TestCase);


#define PP_CONCAT_I(a, b) a##b
#define PP_CONCAT(a, b) PP_CONCAT_I(a, b)
#define PP_STRINGIFY_I(a) #a
#define PP_STRINGIFY(a) PP_STRINGIFY_I(a)
#define TEST_II(name, funcName)                         \
  static void funcName();                               \
  namespace { UnitTest UT_##funcName{name, funcName}; } \
  static void funcName()
#define TEST_I(name, funcName) TEST_II(name, funcName)

#define TEST(name) TEST_I(name, PP_CONCAT(test_line_, __LINE__))
#define CHECK(...) check(TestCase{__FILE__, PP_STRINGIFY(__LINE__), __VA_ARGS__})
#define CHECKRNG(...) CHECK(__VA_ARGS__, .range={'[', ']'})
#define CHECKRNGL(...) CHECK(__VA_ARGS__, '^', {'[', ']'})
