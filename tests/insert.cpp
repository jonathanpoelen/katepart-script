/*
    SPDX-FileCopyrightText: 2023 Jonathan Poelen <jonathan.poelen+katescript@gmail.com>

    SPDX-License-Identifier: MIT
*/

#include "test.hpp"

TEST("insert")
{
  CHECK("insert 3 x", "|\n\n\n\n", "|x\nx\nx\n\n");
  CHECK("insert 3 x", "\n|\n\n\n", "\n|x\nx\nx\n");
  CHECK("insert 3 x", "\n\n|\n\n", "\n\n|x\nx\nx");
  CHECK("insert 3 x", "\n\n\n|\n", "\n\n\n|x\nx");

  CHECK("insert !3 x", "\n|\n\n\n", "\n|x\nx\n\n");
  CHECK("insert !3 x", "\n\n\n\n|", "\n\nx\nx\n|x");
  CHECK("insert !3 x", "\n\n|\n\n", "\n\n|x\n\n");

  CHECK("insert -3 x", "\n\n\n|\n", "\nx\nx\n|x\n");
  CHECK("insert -3 x", "\n\n|\n\n", "x\nx\n|x\n\n");
  CHECK("insert -3 x", "\n|\n\n\n", "x\n|x\n\n\n");

  CHECK("insert 3 x", "aa|a\naaa\naaa\naaa\n", "aa|xa\naaxa\naaxa\naaa\n");
  CHECK("insert 3 x", "aa|a\n\naaa\naaa\n", "aa|xa\n  x\naaxa\naaa\n");

  CHECK("insert 5~1 x", "|\n\n\n\n\n\n", "|x\n\nx\n\nx\n\n");
  CHECK("insert 10~2~2 x", "|\n\n\n\n\n\n\n\n\n\n\n", "|x\nx\n\n\nx\nx\n\n\nx\nx\n\n");
  CHECK("insert 10~2~2~1 x", "|\n\n\n\n\n\n\n\n\n\n\n", "|\nx\nx\n\n\nx\nx\n\n\nx\n\n");
  CHECK("insert 10~2~2~-1 x", "|\n\n\n\n\n\n\n\n\n\n\n", "|x\n\n\nx\nx\n\n\nx\nx\n\n\n");

  CHECKRNG("insert 2", "a[x]a\naaa\naaa\naaa\n", "a[x]|a\naxaa\naxaa\naaa\n");
  CHECKRNG("insert 2", "a[x]a\n\naaa\naaa\n", "a[x]|a\n x\naxaa\naaa\n");
  CHECKRNGL("insert 2", "a[x]a\n\naaa\naaa\n", "a[|x]a\n x\naxaa\naaa\n");

  CHECKRNG("insert !3", "a[x]a\naaa\naaa\naaa\n", "a[x]|a\naxaa\naxaa\naaa\n");
  CHECKRNG("insert !3", "aaa\naaa\naaa\na[x]aa\n", "aaa\naaa\naxaa\na[x]|aa\n");
  CHECKRNGL("insert !3", "aaa\naaa\naaa\na[x]aa\n", "aaa\naaa\naxaa\na[|x]aa\n");

  CHECKRNG("insert -2", "a[x]a\naaa\naaa\naaa\n", "a[x]|a\naaa\naaa\naaa\n");
  CHECKRNG("insert -2", "aaa\naaa\naaa\na[x]aa\n", "aaa\naxaa\naxaa\na[x]|aa\n");

  CHECKRNG("insert 2",
    "a[II\nII]a\naaa\naaa\naaa\naaa\n",
    "a[II\nII]|a\naII\nIIaa\naII\nIIaa\naaa\naaa\n");
  CHECKRNG("insert 3",
    "a[II\nII\nII]a\naaa\naaa\naaa\naaa\n",
    "a[II\nII\nII]|a\naII\nII\nIIaa\naII\nII\nIIaa\naII\nII\nIIaa\naaa\n");

  CHECKRNGL("insert 3",
    "a[II\nII\nII]a\naaa\naaa\naaa\naaa\n",
    "a[|II\nII\nII]a\naII\nII\nIIaa\naII\nII\nIIaa\naII\nII\nIIaa\naaa\n");

  CHECKRNG("insert !3",
    "a[II\nII]a\naaa\naaa\naaa\naaa\n",
    "a[II\nII]|a\naII\nIIaa\naII\nIIaa\naaa\naaa\n");
  CHECKRNG("insert !3",
    "a[II\nII\nII]a\naaa\naaa\naaa\naaa\n",
    "a[II\nII\nII]|a\naII\nII\nIIaa\naII\nII\nIIaa\naaa\naaa\n");
  CHECKRNG("insert !3",
    "aa\naaa\naaa\naaa\na[II\nII]aa\n",
    "aa\naaa\naII\nIIaa\naII\nIIaa\na[II\nII]|aa\n");
  CHECKRNG("insert !3",
    "aa\naaa\naaa\naaa\na[II\nII\nII]aa\n",
    "aa\naaa\naII\nII\nIIaa\naII\nII\nIIaa\na[II\nII\nII]|aa\n");

  CHECKRNG("insert -2",
    "aa\naaa\naaa\naaa\na[II\nII]aa\n",
    "aa\naaa\naII\nIIaa\naII\nIIaa\na[II\nII]|aa\n");
  CHECKRNG("insert -3",
    "aa\naaa\naaa\naaa\na[II\nII\nII]aa\n",
    "aa\naII\nII\nIIaa\naII\nII\nIIaa\naII\nII\nIIaa\na[II\nII\nII]|aa\n");
}

TEST("insertx")
{
  CHECK("insertx 3 x y", "|\n\n\n\n", "|x\ny\nx\n\n");
  CHECK("insertx 3 x y", "\n|\n\n\n", "\n|x\ny\nx\n");
  CHECK("insertx 3 x y", "\n\n|\n\n", "\n\n|x\ny\nx");
  CHECK("insertx 3 x y", "\n\n\n|\n", "\n\n\n|x\ny");

  CHECK("insertx !3 x y", "\n|\n\n\n", "\n|x\ny\n\n");
  CHECK("insertx !3 x y", "\n\n\n\n|", "\n\nx\ny\n|x");
  CHECK("insertx !3 x y", "\n\n|\n\n", "\n\n|x\n\n");

  CHECK("insertx -3 x y", "\n\n\n|\n", "\nx\ny\n|x\n");
  CHECK("insertx -3 x y", "\n\n|\n\n", "x\ny\n|x\n\n");
  CHECK("insertx -3 x y", "\n|\n\n\n", "y\n|x\n\n\n");

  CHECK("insertx 4 x y", "|\n\n\n\n", "|x\ny\nx\ny\n");
  CHECK("insertx !5 x y", "\n|\n\n\n", "\n|x\ny\nx\ny");
  CHECK("insertx -4 x y", "\n\n\n|\n", "y\nx\ny\n|x\n");

  CHECK("insertx 3 x y", "aa|a\naaa\naaa\naaa\n", "aa|xa\naaya\naaxa\naaa\n");
  CHECK("insertx 3 x y", "aa|a\n\naaa\naaa\n", "aa|xa\n  y\naaxa\naaa\n");

  CHECKRNG("insertx 2 y", "a[x]a\naaa\naaa\naaa\n", "a[x]|a\nayaa\naxaa\naaa\n");
  CHECKRNG("insertx 2 y", "a[x]a\n\naaa\naaa\n", "a[x]|a\n y\naxaa\naaa\n");

  CHECKRNG("insertx !3 y", "a[x]a\naaa\naaa\naaa\n", "a[x]|a\nayaa\naxaa\naaa\n");
  CHECKRNG("insertx !3 y", "aaa\naaa\naaa\na[x]aa\n", "aaa\naaa\nayaa\na[x]|aa\n");

  CHECKRNG("insertx -2 y", "a[x]a\naaa\naaa\naaa\n", "a[x]|a\naaa\naaa\naaa\n");
  CHECKRNG("insertx -2 y", "aaa\naaa\naaa\na[x]aa\n", "aaa\naxaa\nayaa\na[x]|aa\n");

  CHECKRNG("insertx 2 y",
    "a[II\nII]a\naaa\naaa\naaa\naaa\n",
    "a[II\nII]|a\nayaa\naII\nIIaa\naaa\naaa\n");
  CHECKRNG("insertx 3 y",
    "a[II\nII\nII]a\naaa\naaa\naaa\naaa\n",
    "a[II\nII\nII]|a\nayaa\naII\nII\nIIaa\nayaa\naaa\n");

  CHECKRNG("insertx !3 y",
    "a[II\nII]a\naaa\naaa\naaa\naaa\n",
    "a[II\nII]|a\nayaa\naII\nIIaa\naaa\naaa\n");
  CHECKRNG("insertx !3 y",
    "a[II\nII\nII]a\naaa\naaa\naaa\naaa\n",
    "a[II\nII\nII]|a\nayaa\naII\nII\nIIaa\naaa\naaa\n");
  CHECKRNG("insertx !3 y",
    "aa\naaa\naaa\naaa\na[II\nII]aa\n",
    "aa\naaa\naII\nIIaa\nayaa\na[II\nII]|aa\n");
  CHECKRNG("insertx !3 y",
    "aa\naaa\naaa\naaa\na[II\nII\nII]aa\n",
    "aa\naaa\naII\nII\nIIaa\nayaa\na[II\nII\nII]|aa\n");

  CHECKRNG("insertx -2 y",
    "aa\naaa\naaa\naaa\na[II\nII]aa\n",
    "aa\naaa\naII\nIIaa\nayaa\na[II\nII]|aa\n");
  CHECKRNG("insertx -3 y",
    "aa\naaa\naaa\naaa\na[II\nII\nII]aa\n",
    "aa\nayaa\naII\nII\nIIaa\nayaa\na[II\nII\nII]|aa\n");
}

TEST("insert/e")
{
  CHECK("insert e3 x", "\n|\n\n\n", "\n|\n\n\n");

  CHECK("insert e3 x", "aa|a\naaa\naaa\naaa\n", "aa|xa\naaxa\naaxa\naaa\n");
  CHECK("insert e3 x", "aa|a\n  \naaa\naaa\n", "aa|xa\n  \naaxa\naaa\n");
  CHECK("insert e3 x", "aa|a\n\naaa\naaa\n", "aa|xa\n\naaxa\naaa\n");

  CHECKRNG("insert e2", "a[x]a\naaa\naaa\naaa\n", "a[x]|a\naxaa\naxaa\naaa\n");
  CHECKRNG("insert e2", "a[x]a\n\naaa\naaa\n", "a[x]|a\n\naxaa\naaa\n");
  CHECKRNG("insert e2", "a[x]a\n  \naaa\naaa\n", "a[x]|a\n  \naxaa\naaa\n");
}

TEST("insertx/e")
{
  CHECK("insertx e3 x y", "\n|\n\n\n", "\n|\n\n\n");

  CHECK("insertx e3 x y", "aa|a\naaa\naaa\naaa\n", "aa|xa\naaya\naaxa\naaa\n");
  CHECK("insertx e3 x y", "aa|a\n  \naaa\naaa\n", "aa|xa\n  \naaya\naaa\n");
  CHECK("insertx e3 x y", "aa|a\n\naaa\naaa\n", "aa|xa\n\naaya\naaa\n");
  CHECK("insertx e!4 x y", "aaa\naa|a\n\naaa\naaa\n", "aaa\naa|xa\n\naaya\naaa\n");

  CHECKRNG("insertx e2 y", "a[x]a\naaa\naaa\naaa\n", "a[x]|a\nayaa\naxaa\naaa\n");
  CHECKRNG("insertx e2 y", "a[x]a\n  \naaa\naaa\n", "a[x]|a\n  \nayaa\naaa\n");
  CHECKRNG("insertx e2 y", "a[x]a\n\naaa\naaa\n", "a[x]|a\n\nayaa\naaa\n");
  CHECKRNG("insertx e!4 y", "aaa\na[x]a\n\naaa\naaa\n", "aaa\na[x]|a\n\nayaa\naaa\n");
}

TEST("inserty")
{
  CHECK("inserty x y z", "\n|\n\n\n", "\n|x\ny\nz\n");

  CHECK("inserty x y z", "aa|a\naaa\naaa\naaa\n", "aa|xa\naaya\naaza\naaa\n");
  CHECK("inserty x y z", "aa|a\n  \naaa\naaa\n", "aa|xa\n  y\naaza\naaa\n");

  CHECKRNG("inserty y z", "a[x]a\naaa\naaa\naaa\n", "a[x]|a\nayaa\nazaa\naaa\n");
  CHECKRNG("inserty y z", "a[x]a\n  \naaa\naaa\n", "a[x]|a\n y \nazaa\naaa\n");
}

TEST("insertLeft")
{
  CHECK("insertLeft 3 x", "|\n\n\n\n", "|x\nx\nx\n\n");
  CHECK("insertLeft 3 x", "aa|a\naaaaa\naaaaa\naaaaa\n", "aa|xa\naaaaxa\naaaaxa\naaaaa\n");
}

TEST("insertxLeft")
{
  CHECK("insertxLeft 3 x y", "|\n\n\n\n", "|x\ny\nx\n\n");
  CHECK("insertxLeft 3 x y", "aa|a\naaaaa\naaaaa\naaaaa\n", "aa|xa\naaaaya\naaaaxa\naaaaa\n");
}
