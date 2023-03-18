/*
    SPDX-FileCopyrightText: 2023 Jonathan Poelen <jonathan.poelen+katescript@gmail.com>

    SPDX-License-Identifier: MIT
*/

#include "test.hpp"

TEST("escapeSQ")
{
  CHECK("escapeSQ",   R"(xx = 'aaa\bbb|'ccc"ddd';)", R"(xx = 'aaa\\bbb|\'ccc"ddd';)");
  CHECK("escapeSQ 1", R"(xx = 'aaa\bbb|'ccc"ddd';)", R"(xx = \'aaa\\bbb|\'ccc"ddd\';)");
  CHECK("escapeSQ",   R"(xx = "aaa\bbb|'ccc"ddd";)", R"(xx = "aaa\bbb|'ccc"ddd";)");
  CHECK("escapeSQ 1", R"(xx = "aaa\bbb|'ccc"ddd";)", R"(xx = "aaa\\bbb|\'ccc"ddd";)");

  CHECKRNG("escapeSQ",   R"(xx = '[aaa\bbb|'ccc"ddd]';)", R"(xx = '[aaa\\bbb|\'ccc"ddd]|';)");
  CHECKRNG("escapeSQ 1", R"(xx = '[aaa\bbb|'ccc"ddd]';)", R"(xx = '[aaa\\bbb|\'ccc"ddd]|';)");
  CHECKRNG("escapeSQ",   R"(xx = "[aaa\bbb|'ccc"ddd]";)", R"(xx = "[aaa\\bbb|\'ccc"ddd]|";)");
  CHECKRNG("escapeSQ 1", R"(xx = "[aaa\bbb|'ccc"ddd]";)", R"(xx = "[aaa\\bbb|\'ccc"ddd]|";)");
}

TEST("escapeDQ")
{
  CHECK("escapeDQ",   R"(xx = 'aaa\bbb|'ccc"ddd';)", R"(xx = 'aaa\bbb|'ccc"ddd';)");
  CHECK("escapeDQ 1", R"(xx = 'aaa\bbb|'ccc"ddd';)", R"(xx = 'aaa\\bbb|'ccc\"ddd';)");
  CHECK("escapeDQ",   R"(xx = "aaa\bbb|'ccc"ddd";)", R"(xx = "aaa\\bbb|'ccc\"ddd";)");
  CHECK("escapeDQ 1", R"(xx = "aaa\bbb|'ccc"ddd";)", R"(xx = \"aaa\\bbb|'ccc\"ddd\";)");

  CHECKRNG("escapeDQ",   R"(xx = '[aaa\bbb|'ccc"ddd]';)", R"(xx = '[aaa\\bbb|'ccc\"ddd]|';)");
  CHECKRNG("escapeDQ 1", R"(xx = '[aaa\bbb|'ccc"ddd]';)", R"(xx = '[aaa\\bbb|'ccc\"ddd]|';)");
  CHECKRNG("escapeDQ",   R"(xx = "[aaa\bbb|'ccc"ddd]";)", R"(xx = "[aaa\\bbb|'ccc\"ddd]|";)");
  CHECKRNG("escapeDQ 1", R"(xx = "[aaa\bbb|'ccc"ddd]";)", R"(xx = "[aaa\\bbb|'ccc\"ddd]|";)");
}

TEST("escapeString")
{
  CHECK(R"(escapeString [\'\"\\\\] \\)",   R"(xx = 'aaa\bbb|'ccc"ddd';)", R"(xx = \'aaa\\bbb|\'ccc\"ddd\';)");
  CHECK(R"(escapeString [\'\"\\\\] \\ \')", R"(xx = 'aaa\bbb|'ccc"ddd';)", R"(xx = 'aaa\\bbb|\'ccc\"ddd';)");

  CHECKRNG(R"(escapeString [\'\"\\\\] \\)",   R"(xx = '[aaa\bbb|'ccc"ddd]';)", R"(xx = '[aaa\\bbb|\'ccc\"ddd]|';)");
  CHECKRNG(R"(escapeString [\'\"\\\\] \\ \')", R"(xx = '[aaa\bbb|'ccc"ddd]';)", R"(xx = '[aaa\\bbb|\'ccc\"ddd]|';)");
}
