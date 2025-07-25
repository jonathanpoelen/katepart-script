/*
    SPDX-FileCopyrightText: 2023 Jonathan Poelen <jonathan.poelen+katescript@gmail.com>

    SPDX-License-Identifier: MIT
*/

#include "test.hpp"

TEST("duplicate")
{
  CHECK("duplicate", "abc|", "abc\nabc|");
  CHECK("duplicate", "a|bc", "abc\na|bc");
  CHECK("duplicate 1", "a|bc", "abc\na|bc");
  CHECK("duplicate 2", "a|bc", "abc\nabc\na|bc");
  CHECK("duplicate 3", "a|bc", "abc\nabc\nabc\na|bc");
  CHECK("duplicate -1", "a|bc", "a|bc\nabc");
  CHECK("duplicate -2", "a|bc", "a|bc\nabc\nabc ");
  CHECK("duplicate -3", "a|bc", "a|bc\nabc\nabc\nabc");

  CHECK("duplicate", "|", "\n|");
  CHECK("duplicate -1", "|", "|\n");

  CHECKRNG("duplicate", "ab[c]", "abc[c]|");
  CHECKRNG("duplicate", "a[b]c", "ab[b]|c");
  CHECKRNG("duplicate", "a[bc]d", "abc[bc]|d");
  CHECKRNG("duplicate 1", "a[bc]d", "abc[bc]|d");
  CHECKRNG("duplicate 2", "a[bc]d", "abcbc[bc]|d");
  CHECKRNG("duplicate 3", "a[bc]d", "abcbcbc[bc]|d");
  CHECKRNG("duplicate -1", "a[bc]d", "a[bc]|bcd");
  CHECKRNG("duplicate -2", "a[bc]d", "a[bc]|bc bcd");
  CHECKRNG("duplicate -3", "a[bc]d", "a[bc]|bcbcbcd");
  CHECKRNGL("duplicate -3", "a[bc]d", "a[|bc]bcbcbcd");
}
