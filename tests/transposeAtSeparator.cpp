/*
    SPDX-FileCopyrightText: 2023 Jonathan Poelen <jonathan.poelen+katescript@gmail.com>

    SPDX-License-Identifier: MIT
*/

#include "test.hpp"

TEST("transposeAtSeparator")
{
  CHECK("transposeAtSeparator -",       "ab - cd| - ef - gh", "cd - ef - gh - ab|");
  CHECK("transposeAtSeparator - 1 1",   "ab - cd| - ef - gh", "ef - gh - ab - cd|");
  CHECK("transposeAtSeparator - 1 2",   "ab - cd| - ef - gh", "gh - ab - cd - ef|");
  CHECK("transposeAtSeparator - 1 -1",  "ab - cd| - ef - gh", "gh - ab - cd - ef|");
  CHECK("transposeAtSeparator - 1 -2",  "ab - cd| - ef - gh", "ef - gh - ab - cd|");

  CHECKRNG("transposeAtSeparator -",   "ab - [cd - ef] - gh", "ab - ef - cd| - gh");
  CHECKRNG("transposeAtSeparator - 0", "ab - [cd - ef] - gh", "ab -  ef-cd | - gh");

  CHECKRNG("transposeAtSeparator - 1 1", "ab - [cd - ef - gh]", "ab - gh - cd - ef|");

  CHECKRNG("transposeAtSeparator '\\n'", "ab - [cd - ef\nEF - GH]x", "ab - EF - GH\ncd - ef|x");
}

TEST("transposeAtRegexSeparator")
{
  CHECK("transposeAtRegexSeparator -",       "ab - cd| - ef - gh", "cd - ef - gh - ab|");
  CHECK("transposeAtRegexSeparator - 1 1",   "ab - cd| - ef - gh", "ef - gh - ab - cd|");
  CHECK("transposeAtRegexSeparator - 1 2",   "ab - cd| - ef - gh", "gh - ab - cd - ef|");
  CHECK("transposeAtRegexSeparator - 1 -1",  "ab - cd| - ef - gh", "gh - ab - cd - ef|");
  CHECK("transposeAtRegexSeparator - 1 -2",  "ab - cd| - ef - gh", "ef - gh - ab - cd|");

  CHECKRNG("transposeAtRegexSeparator -",   "ab - [cd - ef] - gh", "ab - ef - cd| - gh");
  CHECKRNG("transposeAtRegexSeparator - 0", "ab - [cd - ef] - gh", "ab -  ef-cd | - gh");

  CHECKRNG("transposeAtRegexSeparator - 1 1", "ab - [cd - ef - gh]", "ab - gh - cd - ef|");

  CHECKRNG("transposeAtRegexSeparator '\\n'", "ab - [cd - ef\nEF - GH]x", "ab - EF - GH\ncd - ef|x");
}

TEST("smartTransposeAtSeparator")
{
  CHECK("smartTransposeAtSeparator", "foo(,|, b)", "foo(,b, |)");
  CHECK("smartTransposeAtSeparator", "foo(, |, b)", "foo(, b, |)");
  CHECK("smartTransposeAtSeparator", "foo(a|,b)", "foo(b,a|)");
  CHECK("smartTransposeAtSeparator", "foo(a|, b)", "foo(b, a|)");
  CHECK("smartTransposeAtSeparator", "foo(a,| b)", "foo(b, a|)");
  CHECK("smartTransposeAtSeparator", "foo(a, |b)", "foo(b, a|)");
  CHECK("smartTransposeAtSeparator", "foo(a|, b, c)", "foo(b, a|, c)");
  CHECK("smartTransposeAtSeparator", "foo(a, b|, c)", "foo(a, c, b|)");
  CHECK("smartTransposeAtSeparator", "foo(a[1]|, b)", "foo(b, a[1]|)");
  CHECK("smartTransposeAtSeparator", "foo(a <=|> b)", "foo(b> a <=|)");
  CHECK("smartTransposeAtSeparator <=>", "foo(a <=|> b)", "foo(b <=> a|)");
  CHECK("smartTransposeAtSeparator =>", "foo(a <=|> b)", "foo(b=> a <|)");
  CHECK("smartTransposeAtSeparator , ~", "foo(~a, b~|, ~c, d~)", "foo(~c, d~, ~a, b~|)");

  // don't capture enclosing char who is not a pair

  CHECK("smartTransposeAtSeparator = ;", "a |= b;", "b = a|;");

  CHECK("smartTransposeAtSeparator = ;", "a = |b;", "b = a|;");
  // equivalent to
  CHECK("smartTransposeAtSeparator = '' 1 '' ;", "a = |b;", "b = a|;");

  CHECK("smartTransposeAtSeparator - '=;'", "n = first |- last;", "n = last - first|;");
  // equivalent to
  CHECK("smartTransposeAtSeparator - '' 1 '' =;", "n = first |- last;", "n = last - first|;");
}

TEST("smartTransposeAtRegexSeparator")
{
  CHECK("smartTransposeAtRegexSeparator <=>", "foo(a <=|> b)", "foo(b <=> a|)");
}

TEST("smartTransposeAtSeparatorWithRange")
{
  CHECKRNG("smartTransposeAtSeparator", "[foo(,, b)]", "[foo(b,, )]|");
  CHECKRNG("smartTransposeAtSeparator", "[foo(, , b)]", "[foo(, b, )]|");
  CHECKRNG("smartTransposeAtSeparator", "[foo(a,b)]", "[foo(b,a)]|");
  CHECKRNG("smartTransposeAtSeparator", "[foo(a, b)]", "[foo(b, a)]|");
  CHECKRNG("smartTransposeAtSeparator", "[foo(a, b, c)]", "[foo(b, a, c)]|");
  CHECKRNG("smartTransposeAtSeparator", "[foo(a{1}, b)]", "[foo(b, a{1})]|");
  CHECKRNG("smartTransposeAtSeparator", "[foo(a <=> b)]", "[foo(b <=> a)]|");
  CHECKRNG("smartTransposeAtSeparator <=>", "[foo(a <=> b)]", "[foo(b <=> a)]|");
  CHECKRNG("smartTransposeAtSeparator =>", "[foo(a <=> b)]", "[foo(b=> a <)]|");
  CHECKRNG("smartTransposeAtSeparator , ~", "[foo(~a, b~, ~c, d~)]", "[foo(~c, d~, ~a, b~)]|");
  CHECKRNG("smartTransposeAtSeparator", "[ab cd\n --- \nef gh]", "ef gh\n --- \nab cd|");
  CHECKRNG("smartTransposeAtSeparator", "[ab cd\n(xxx - yyy)\nef gh]", "[ab cd\n(yyy - xxx)\nef gh]|");
}

TEST("smartTransposeAtRegexSeparatorWithRange")
{
  CHECKRNG("smartTransposeAtRegexSeparator <=>", "[foo(a <=> b)]", "[foo(b <=> a)]|");
}
