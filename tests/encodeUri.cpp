/*
    SPDX-FileCopyrightText: 2023 Jonathan Poelen <jonathan.poelen+katescript@gmail.com>

    SPDX-License-Identifier: MIT
*/

#include "test.hpp"

TEST("encodeUri")
{
  CHECK("encodeUri http://example.org/abc def?a=x y z", "", "http://example.org/abc%20def?a=x%20y%20z|");
  CHECK("encodeUri", "http://example.org/abc def?a=x y z|", "http://example.org/abc%20def?a=x%20y%20z|");
  CHECKRNG("encodeUri", "x[http://example.org/abc def?a=x y z] y", "x[http://example.org/abc%20def?a=x%20y%20z]| y");
}

TEST("decodeUri")
{
  CHECK("decodeUri http://example.org/abc%20def?a=x%20y%20z", "", "http://example.org/abc def?a=x y z|");
  CHECK("decodeUri", "http://example.org/abc%20def?a=x%20y%20z", "http://example.org/abc def?a=x y z|");
  CHECKRNG("decodeUri", "x[http://example.org/abc%20def?a=x%20y%20z] y", "x[http://example.org/abc def?a=x y z]| y");
}
