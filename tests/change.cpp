/*
    SPDX-FileCopyrightText: 2023 Jonathan Poelen <jonathan.poelen+katescript@gmail.com>

    SPDX-License-Identifier: MIT
*/

#include "test.hpp"

TEST("change")
{
  CHECK("change i", "a[i] = i; b[i] = i; |c[i] = i;", "a[i] = i; b[i] = i; |c[i] = i;");
  CHECK("change i 0", "a[i] = i; b[i] = i; |c[i] = i;", "a[0] = 0; b[0] = 0; |c[0] = 0;");
  CHECK("change i 0 1", "a[i] = i; b[i] = i; |c[i] = i;", "a[0] = 1; b[0] = 1; |c[0] = 1;");
  CHECK("change i 00 1", "a[i] = i; b[i] = i; |c[i] = i;", "a[00] = 1; b[00] = 1; |c[00] = 1;");

  CHECK("change '' 0", "a[i] = i; b[i] = i; |c[i] = i;", "0a0[0i0]0 0=0 0i0;0 0b0[0i0]0 0=0 0i0;0 |0c0[0i0]0 0=0 0i0;");

  CHECK("change i 0 1", "a[i] = <i; b[i] = i; c[i]> = i;", "a[i] = <0; b[1] = 0; c[1]>| = i;",
    .range={'<', '>'});
}

TEST("change/r")
{
  CHECK("change/r", "a[i] = I; b[i] = I; |c[i] = I;", "a[i] = I; b[i] = I; |c[i] = I;");
  CHECK("change/r [iI] 0", "a[i] = I; b[i] = I; |c[i] = I;", "a[0] = 0; b[0] = 0; |c[0] = 0;");
  CHECK("change/r [iI] 0 1", "a[i] = I; b[i] = I; |c[i] = I;", "a[0] = 1; b[0] = 1; |c[0] = 1;");
  CHECK("change/r [iI] ''", "a[i] = I; b[i] = I; |c[i] = I;", "a[] = ; b[] = ; |c[] = ;");

  CHECK("change/r '' 0", "a[i] = I; b[i] = I; |c[i] = I;", "0a0[0i0]0 0=0 0I0;0 0b0[0i0]0 0=0 0I0;0 |0c0[0i0]0 0=0 0I0;0");

  CHECK("change/r [iI] 0 1", "a[i] = <I; b[i] = I; c[i]> = I;", "a[i] = <0; b[1] = 0; c[1]>| = I;",
    .range={'<', '>'});
}

TEST("change/ri")
{
  CHECK("change/ri i", "a[i] = I; b[i] = I; |c[i] = I;", "a[i] = I; b[i] = I; |c[i] = I;");
  CHECK("change/ri i 0", "a[i] = I; b[i] = I; |c[i] = I;", "a[0] = 0; b[0] = 0; |c[0] = 0;");
  CHECK("change/ri i 0 1", "a[i] = I; b[i] = I; |c[i] = I;", "a[0] = 1; b[0] = 1; |c[0] = 1;");

  CHECK("change/ri i 0 1", "a[i] = <I; b[i] = I; c[i]> = I;", "a[i] = <0; b[1] = 0; c[1]>| = I;",
    .range={'<', '>'});
}

TEST("changex")
{
  CHECK("changex", "a[i] = I; b[i] = I; |c[i] = I;", "a[i] = I; b[i] = I; |c[i] = I;");
  CHECK("changex 0", "a[i] = I; b[i] = I; |c[i] = I;", "a[i] = I; b[i] = I; |c[i] = I;");
  CHECK("changex 1 i", "a[i] = I; b[i] = I; |c[i] = I;", "a[] = I; b[] = I; |c[] = I;");
  CHECK("changex 1 i 0", "a[i] = I; b[i] = I; |c[i] = I;", "a[0] = I; b[0] = I; |c[0] = I;");
  CHECK("changex 2 i I 0", "a[i] = I; b[i] = I; |c[i] = I;", "a[0] = 0; b[0] = 0; |c[0] = 0;");
  CHECK("changex 2 i I 0 1", "a[i] = I; b[i] = I; |c[i] = I;", "a[0] = 1; b[0] = 1; |c[0] = 1;");
  CHECK("changex 2 i I 0 1 2", "a[i] = I; b[i] = I; |c[i] = I;", "a[0] = 1; b[2] = 0; |c[1] = 2;");

  CHECK("changex 2 i I 0 1", "a[i] = <I; b[i] = I; c[i]> = I;", "a[i] = <I; b[0] = 1; c[0]>| = I;",
    .range={'<', '>'});
  CHECK("changex 2 I i 0 1", "a[i] = <I; b[i] = I; c[i]> = I;", "a[i] = <0; b[1] = 0; c[1]>| = I;",
    .range={'<', '>'});
}

TEST("changex/r")
{
  CHECK("changex/r", "a[i] = I; b[i] = I; |c[i] = I;", "a[i] = I; b[i] = I; |c[i] = I;");
  CHECK("changex/r 0", "a[i] = I; b[i] = I; |c[i] = I;", "a[i] = I; b[i] = I; |c[i] = I;");
  CHECK("changex/r 1 [xi]", "a[i] = I; b[i] = I; |c[i] = I;", "a[] = I; b[] = I; |c[] = I;");
  CHECK("changex/r 1 [xi] 0", "a[i] = I; b[i] = I; |c[i] = I;", "a[0] = I; b[0] = I; |c[0] = I;");
  CHECK("changex/r 2 [xi] [xI] 0 1", "a[i] = I; b[i] = I; |c[i] = I;", "a[0] = 1; b[0] = 1; |c[0] = 1;");
  CHECK("changex/r 2 [xi] [xI] 0 1 2", "a[i] = I; b[i] = I; |c[i] = I;", "a[0] = 1; b[2] = 0; |c[1] = 2;");

  CHECK("changex/r 2 [xi] [xI] 0 1", "a[i] = <I; b[i] = I; c[i]> = I;", "a[i] = <I; b[0] = 1; c[0]>| = I;",
    .range={'<', '>'});
  CHECK("changex/r 2 [xI] [xi] 1 0", "a[i] = <I; b[i] = I; c[i]> = I;", "a[i] = <1; b[0] = 1; c[0]>| = I;",
    .range={'<', '>'});
}

TEST("changex/ri")
{
  CHECK("changex/ri", "a[i] = I; b[i] = I; |c[i] = I;", "a[i] = I; b[i] = I; |c[i] = I;");
  CHECK("changex/ri 0", "a[i] = I; b[i] = I; |c[i] = I;", "a[i] = I; b[i] = I; |c[i] = I;");
  CHECK("changex/ri 1 [xi] 0", "a[i] = I; b[i] = I; |c[i] = I;", "a[0] = 0; b[0] = 0; |c[0] = 0;");
  CHECK("changex/ri 2 [xi] [xi] 0 1", "a[i] = I; b[i] = I; |c[i] = I;", "a[0] = 1; b[0] = 1; |c[0] = 1;");
  CHECK("changex/ri 2 [xi] [xi] 0 1 2", "a[i] = I; b[i] = I; |c[i] = I;", "a[0] = 1; b[2] = 0; |c[1] = 2;");

  CHECK("changex/ri 2 [xi] [xi] 0 1", "a[i] = <I; b[i] = I; c[i]> = I;", "a[i] = <0; b[1] = 0; c[1]>| = I;",
    .range={'<', '>'});
}

TEST("changey")
{
  CHECK("changey", "a[i] = I; b[i] = I; |c[i] = I;", "a[i] = I; b[i] = I; |c[i] = I;");
  CHECK("changey 0", "a[i] = I; b[i] = I; |c[i] = I;", "a[i] = I; b[i] = I; |c[i] = I;");
  CHECK("changey 1", "a[i] = I; b[i] = I; |c[i] = I;", "a[i] = I; b[i] = I; |c[i] = I;");
  CHECK("changey 1 i", "a[i] = I; b[i] = I; |c[i] = I;", "a[] = I; b[] = I; |c[] = I;");
  CHECK("changey 1 i 0", "a[i] = I; b[i] = I; |c[i] = I;", "a[0] = I; b[0] = I; |c[0] = I;");
  CHECK("changey 1 i 0 I 1", "a[i] = I; b[i] = I; |c[i] = I;", "a[0] = 1; b[0] = 1; |c[0] = 1;");
  CHECK("changey 2 i 0 1", "a[i] = I; b[i] = I; |c[i] = I;", "a[0] = I; b[1] = I; |c[0] = I;");
  CHECK("changey 2 i 0 1 I 2 3", "a[i] = I; b[i] = I; |c[i] = I;", "a[0] = I; b[1] = 2; |c[i] = 3;");

  CHECK("changey 1 i 0 I 1", "a[i] = <I; b[i] = I; c[i]> = I;", "a[i] = <I; b[0] = 1; c[0]>| = I;",
    .range={'<', '>'});
  CHECK("changey 1 I 1 i 0", "a[i] = <I; b[i] = I; c[i]> = I;", "a[i] = <1; b[0] = 1; c[0]>| = I;",
    .range={'<', '>'});
}

TEST("changey/r")
{
  CHECK("changey/r", "a[i] = I; b[i] = I; |c[i] = I;", "a[i] = I; b[i] = I; |c[i] = I;");
  CHECK("changey/r 0", "a[i] = I; b[i] = I; |c[i] = I;", "a[i] = I; b[i] = I; |c[i] = I;");
  CHECK("changey/r 1 [xi]", "a[i] = I; b[i] = I; |c[i] = I;", "a[] = I; b[] = I; |c[] = I;");
  CHECK("changey/r 1 [xi] 0", "a[i] = I; b[i] = I; |c[i] = I;", "a[0] = I; b[0] = I; |c[0] = I;");
  CHECK("changey/r 1 [xi] 0 [xI] 1", "a[i] = I; b[i] = I; |c[i] = I;", "a[0] = 1; b[0] = 1; |c[0] = 1;");
  CHECK("changey/r 2 [iI] 0 1", "a[i] = I; b[i] = I; |c[i] = I;", "a[0] = 1; b[0] = 1; |c[0] = 1;");
  CHECK("changey/r 2 [iI] 0 1 [iI] 2 3", "a[i] = I; b[i] = I; |c[i] = I;", "a[0] = 1; b[2] = 3; |c[0] = 1;");

  CHECK("changey/r 1 [xi] 0 [xI] 1", "a[i] = <I; b[i] = I; c[i]> = I;", "a[i] = <I; b[0] = 1; c[0]>| = I;",
    .range={'<', '>'});
  CHECK("changey/r 1 [xI] 1 [xi] 0", "a[i] = <I; b[i] = I; c[i]> = I;", "a[i] = <1; b[0] = 1; c[0]>| = I;",
    .range={'<', '>'});
}

TEST("changey/ri")
{
  CHECK("changey/ri", "a[i] = I; b[i] = I; |c[i] = I;", "a[i] = I; b[i] = I; |c[i] = I;");
  CHECK("changey/ri 0", "a[i] = I; b[i] = I; |c[i] = I;", "a[i] = I; b[i] = I; |c[i] = I;");
  CHECK("changey/ri 1 [xi] 0", "a[i] = I; b[i] = I; |c[i] = I;", "a[0] = 0; b[0] = 0; |c[0] = 0;");
  CHECK("changey/ri 1 [xi] 0 [xi] 1", "a[i] = I; b[i] = I; |c[i] = I;", "a[0] = 1; b[0] = 1; |c[0] = 1;");
  CHECK("changey/ri 2 i 0 1", "a[i] = I; b[i] = I; |c[i] = I;", "a[0] = 1; b[0] = 1; |c[0] = 1;");
  CHECK("changey/ri 2 i 0 1 i 2 3", "a[i] = I; b[i] = I; |c[i] = I;", "a[0] = 1; b[2] = 3; |c[0] = 1;");

  CHECK("changey/ri 1 [xi] 0 [xi] 1", "a[i] = <I; b[i] = I; c[i]> = I;", "a[i] = <0; b[1] = 0; c[1]>| = I;",
    .range={'<', '>'});
}
