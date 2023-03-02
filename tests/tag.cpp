/*
    SPDX-FileCopyrightText: 2023 Jonathan Poelen <jonathan.poelen+katescript@gmail.com>

    SPDX-License-Identifier: MIT
*/

#include "test.hpp"

TEST("tag")
{
  CHECK("tag abc", "xxx|yyy", "xxx<abc>|</abc>yyy");
  CHECK("tag", "xxx|yyy", "<xxxyyy>|</xxxyyy>");
  CHECK("tag", " xxx |yyy ", " xxx <yyy>|</yyy> ");
  CHECK("tag", " xxx| yyy ", " <xxx>|</xxx> yyy ");
  CHECK("tag", " xxx | yyy ", " xxx  <yyy>|</yyy> ");
  CHECKRNG("tag", " xx[xy]yy ", " xx<xy>|</xy>yy ");

  CHECK("tag abc 1", "xxx|yyy", "xxx<abc>\n  |\n</abc>yyy");
  CHECK("tag abc 1", "  xxx|yyy", "  xxx<abc>\n    |\n  </abc>yyy");
  CHECK("tag 1", "xxx|yyy", "<xxxyyy>\n  |\n</xxxyyy>");
  CHECK("tag 1", " xxx |yyy ", " xxx <yyy>\n  |\n </yyy> ");
  CHECK("tag 1", " xxx |yyy a", " xxx <yyy>\n  |\n </yyy> a");
  CHECK("tag 1", " xxx| yyy ", " <xxx>\n  |\n </xxx> yyy ");
  CHECK("tag 1", " xxx | yyy ", " xxx  <yyy>\n  |\n </yyy> ");
  CHECKRNG("tag 1", " xx[xy]yy ", " xx<xy>\n  |\n </xy>yy ");
}

TEST("wrapTag")
{
  CHECK("wrapTag abc", "xxx|yyy", "<abc>xxx|yyy</abc>");
  CHECK("wrapTag abc 1", "xxx|yyy", "<abc>\n  xxx|yyy\n</abc>");
  CHECK("wrapTag abc 1", " xxx|yyy", " <abc>\n  xxx|yyy\n </abc>");

  CHECKRNG("wrapTag abc", " xx[xy]yy ", " xx[<abc>xy</abc>]|yy ");
  CHECKRNG("wrapTag abc 1", " xx[xy]yy ", " xx\n [<abc>\n  xy\n </abc>]\n |yy ");
}
