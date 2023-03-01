/*
    SPDX-FileCopyrightText: 2023 Jonathan Poelen <jonathan.poelen+katescript@gmail.com>

    SPDX-License-Identifier: MIT
*/

#include "test.hpp"

TEST("count")
{
  CHECK("count l", "abc def-ghi j--k |", "abc def-ghi j--k 1|");
  CHECK("count w", "abc def-ghi j--k |", "abc def-ghi j--k 5|");
  CHECK("count W", "abc def-ghi j--k |", "abc def-ghi j--k 3|");
  CHECK("count r '\\s+'", " abc def-ghi j--k |", " abc def-ghi j--k 3|");
  CHECK("count r '\\s+'", " abc def-ghi j--k|", " abc def-ghi j--k3|");
  CHECK("count r '\\s+'", "abc def-ghi j--k |", "abc def-ghi j--k 3|");
  CHECK("count r '\\s+'", "abc def-ghi j--k|", "abc def-ghi j--k3|");
  CHECK("count c", "abc def-ghi j--k |", "abc def-ghi j--k 17|");
  CHECK("count",   "abc def-ghi j--k |", "abc def-ghi j--k 17|");

  CHECKRNG("count l", "[abc def-ghi\nj--k ]", "[abc def-ghi\nj--k ]2|");
  CHECKRNG("count w", "[abc def-ghi\nj--k ]", "[abc def-ghi\nj--k ]5|");
  CHECKRNG("count W", "[abc def-ghi\nj--k ]", "[abc def-ghi\nj--k ]3|");
  CHECKRNG("count r '\\s+'", "[ abc def-ghi\nj--k ]", "[ abc def-ghi\nj--k ]3|");
  CHECKRNG("count r '\\s+'", "[ abc def-ghi\nj--k]", "[ abc def-ghi\nj--k]3|");
  CHECKRNG("count r '\\s+'", "[abc def-ghi\nj--k ]", "[abc def-ghi\nj--k ]3|");
  CHECKRNG("count r '\\s+'", "[abc def-ghi\nj--k]", "[abc def-ghi\nj--k]3|");
  CHECKRNG("count c", "[abc def-ghi\nj--k ]", "[abc def-ghi\nj--k ]17|");
  CHECKRNG("count",   "[abc def-ghi\nj--k ]", "[abc def-ghi\nj--k ]17|");
}
