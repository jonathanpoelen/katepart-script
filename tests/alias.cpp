/*
    SPDX-FileCopyrightText: 2023 Jonathan Poelen <jonathan.poelen+katescript@gmail.com>

    SPDX-License-Identifier: MIT
*/

#include "test.hpp"

TEST("execCmd")
{
  CHECK("execCmd duplicate", "abc|", "abc\nabc|");
  CHECK("alias duplicate duplicate 3", "abc|", "abc|");
  CHECK("execCmd duplicate", "abc|", "abc\nabc\nabc\nabc|");

  CHECK("alias t tag xyz", "abc|", "abc|");
  CHECK("execCmd t", "abc|", "abc<xyz>|</xyz>");
  CHECK("execCmd t 1", "abc|", "abc<xyz>\n  |\n</xyz>");

  CHECK("alias :t tag 1", "abc|", "abc|");
  CHECK("execCmd t", "abc|", "<abc>\n  |\n</abc>");
  CHECK("execCmd t xyz", "abc|", "abc<xyz>\n  |\n</xyz>");

  CHECK("createExpression ii document.insertText(view.cursorPosition(), 1 + 1 + arguments[0])", "abc|", "abc|");
  CHECK("execCmd ii 1", "abc|", "abc21|");

  CHECK("createFunction ii n 'document.insertText(view.cursorPosition(), 1 + 1 + n)'", "abc|", "abc|");
  CHECK("execCmd ii 1", "abc|", "abc21|");
}
