/*
    SPDX-FileCopyrightText: 2023 Jonathan Poelen <jonathan.poelen+katescript@gmail.com>

    SPDX-License-Identifier: MIT
*/

#include "test.hpp"

TEST("jumpParagraphDown")
{
  CHECK("jumpParagraphDown", "|\n\na\na\n\nb\nb\n", "\n\n|a\na\n\nb\nb\n");
  CHECK("jumpParagraphDown", "|a\na\n\nb\nb\n", "a\na\n\n|b\nb\n");
  CHECK("jumpParagraphDown", "a|\na\n\nb\nb\n", "a\na\n\nb|\nb\n");
  CHECK("jumpParagraphDown", "a\n|a\n\nb\nb\n", "a\na\n\n|b\nb\n");
  CHECK("jumpParagraphDown", "a\naaa|\n\nb\nb\n", "a\naaa\n\nb|\nb\n");
  CHECK("jumpParagraphDown", "a\naaa\n\n|b\nb", "a\naaa\n\nb\nb\n|");

  CHECK("jumpParagraphDown", "|a\na\n  \nb\nb\n", "a\na\n  \n|b\nb\n");
  CHECK("jumpParagraphDown", "a\na\n|\nb\nb\n", "a\na\n\n|b\nb\n");
}

TEST("jumpParagraphUp")
{
  CHECK("jumpParagraphUp", "\n\na\na\n\nb\nb\n\n|", "\n\na\na\n\nb\n|b\n\n");
  CHECK("jumpParagraphUp", "a\na\n\nb\nb|\n", "a\na|\n\nb\nb\n");
  CHECK("jumpParagraphUp", "a\na\n\nb\n|b\n", "a\n|a\n\nb\nb\n");
  CHECK("jumpParagraphUp", "a\na\n\nb|\nb\n", "a\na|\n\nb\nb\n");
  CHECK("jumpParagraphUp", "a\na\n\nb\nbbb|\n", "a\na|\n\nb\nbbb\n");
  CHECK("jumpParagraphUp", "a\n|a\n\nb\nbbb\n", "|a\na\n\nb\nbbb\n");

  CHECK("jumpParagraphUp", "a\na\n  \nb\n|b\n", "a\n|a\n  \nb\nb\n");
  CHECK("jumpParagraphUp", "a\na\n|\nb\nb\n", "a\n|a\n\nb\nb\n");
}
