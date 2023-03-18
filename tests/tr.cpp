/*
    SPDX-FileCopyrightText: 2023 Jonathan Poelen <jonathan.poelen+katescript@gmail.com>

    SPDX-License-Identifier: MIT
*/

#include "test.hpp"

TEST("tr")
{
  CHECK("tr", "|", "|");
  CHECK("tr a b", "|a", "|b");
  CHECK("tr a b", "|aa", "|bb");
  CHECK("tr a b", "a|a", "b|b");
  CHECK("tr a ''", "aabb|", "bb|");
  CHECK("tr ab xy", "aabb|", "xxyy|");
  CHECK("tr ab ba", "aabb|", "bbaa|");
  CHECK("tr ab c", "abd|", "ccd|");
  CHECK("tr ab c 1", "abd|", "cd|");

  CHECK("tr a", "aabb|", "bb|");
  CHECK("tr ab", "aabb|", "bbaa|");
  CHECK("tr ab ''", "aabbx|", "x|");

  CHECK("tr ' ' '\n'", " abc|", "\nabc|");

  CHECKRNG("tr a b", "[a]a", "[b]|a");
  CHECKRNG("tr a b", "a[ab]b", "a[bb]|b");
  CHECKRNG("tr ab xy", "a[ab]b", "a[xy]|b");
  CHECKRNG("tr ab ba", "a[ab]b", "a[ba]|b");
  CHECKRNG("tr ab c", "a[bd]", "a[cd]|");
  CHECKRNGL("tr ab c", "a[bd]", "a[|cd]");
  CHECKRNGL("tr ab c 1", "a[bd]", "a[|d]");
}

TEST("tr/I")
{
  CHECK("tr/I a c", "abdABD|", "cbdcBD|");
  CHECK("tr/I A c", "abdABD|", "cbdcBD|");
  CHECK("tr/I a C", "abdABD|", "CbdCBD|");
  CHECK("tr/I A C", "abdABD|", "CbdCBD|");
}

TEST("tr/i")
{
  CHECK("tr/i . m", "ab.AB|", "abmAB|");
  CHECK("tr/i . U", "ab.AB|", "abUAB|");
  CHECK("tr/i a m", "ab.AB|", "mb.MB|");
  CHECK("tr/i a U", "ab.AB|", "Ub.uB|");
  CHECK("tr/i A m", "ab.AB|", "mb.MB|");
  CHECK("tr/i A U", "ab.AB|", "Ub.uB|");

  CHECK("tr/i ab m", "ab.AB|", "mm.MM|");
  CHECK("tr/i ab U", "ab.AB|", "UU.uu|");
  CHECK("tr/i AB m", "ab.AB|", "mm.MM|");
  CHECK("tr/i AB U", "ab.AB|", "UU.uu|");

  CHECK("tr/i ab m 1", "ab.AB|", "m.M|");
  CHECK("tr/i ab U 1", "ab.AB|", "U.u|");
  CHECK("tr/i AB m 1", "ab.AB|", "m.M|");
  CHECK("tr/i AB U 1", "ab.AB|", "U.u|");
}

TEST("tr/l")
{
  CHECK("tr/l . m", "ab.AB|", "abmAB|");
  CHECK("tr/l . U", "ab.AB|", "abUAB|");
  CHECK("tr/l a m", "ab.AB|", "mb.MB|");
  CHECK("tr/l a U", "ab.AB|", "Ub.uB|");
  CHECK("tr/l A m", "ab.AB|", "ab.mB|");
  CHECK("tr/l A U", "ab.AB|", "ab.UB|");

  CHECK("tr/l ab m", "ab.AB|", "mm.MM|");
  CHECK("tr/l ab U", "ab.AB|", "UU.uu|");
  CHECK("tr/l AB m", "ab.AB|", "ab.mm|");
  CHECK("tr/l AB U", "ab.AB|", "ab.UU|");

  CHECK("tr/l ab m 1", "ab.AB|", "m.M|");
  CHECK("tr/l ab U 1", "ab.AB|", "U.u|");
  CHECK("tr/l AB m 1", "ab.AB|", "ab.m|");
  CHECK("tr/l AB U 1", "ab.AB|", "ab.U|");
}

TEST("tr/u")
{
  CHECK("tr/u . m", "ab.AB|", "abmAB|");
  CHECK("tr/u . U", "ab.AB|", "abUAB|");
  CHECK("tr/u a m", "ab.AB|", "mb.AB|");
  CHECK("tr/u a U", "ab.AB|", "Ub.AB|");
  CHECK("tr/u A m", "ab.AB|", "mb.MB|");
  CHECK("tr/u A U", "ab.AB|", "Ub.uB|");

  CHECK("tr/u ab m", "ab.AB|", "mm.AB|");
  CHECK("tr/u ab U", "ab.AB|", "UU.AB|");
  CHECK("tr/u AB m", "ab.AB|", "mm.MM|");
  CHECK("tr/u AB U", "ab.AB|", "UU.uu|");

  CHECK("tr/u ab m 1", "ab.AB|", "m.AB|");
  CHECK("tr/u ab U 1", "ab.AB|", "U.AB|");
  CHECK("tr/u AB m 1", "ab.AB|", "m.M|");
  CHECK("tr/u AB U 1", "ab.AB|", "U.u|");
}
