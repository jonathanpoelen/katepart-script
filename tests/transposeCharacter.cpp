/*
    SPDX-FileCopyrightText: 2023 Jonathan Poelen <jonathan.poelen+katescript@gmail.com>

    SPDX-License-Identifier: MIT
*/

#include "test.hpp"

TEST("transposeCharacter")
{
  CHECK("transposeCharacter", "|", "|");
  CHECK("transposeCharacter", "|a", "|a");
  CHECK("transposeCharacter", "|ab", "ba|");
  CHECK("transposeCharacter", "|abc", "ba|c");
  CHECK("transposeCharacter", "a|", "a|");
  CHECK("transposeCharacter", "a|b", "ba|");
  CHECK("transposeCharacter", "a|bc", "ba|c");
  CHECK("transposeCharacter", "ab|", "ba|");
  CHECK("transposeCharacter", "ab|c", "acb|");
  CHECK("transposeCharacter", "abc|", "acb|");

  // -1
  CHECK("transposeCharacter -1", "|", "|");
  CHECK("transposeCharacter -1", "|a", "|a");
  CHECK("transposeCharacter -1", "|ab", "ba|");
  CHECK("transposeCharacter -1", "|abc", "ba|c");
  CHECK("transposeCharacter -1", "a|", "a|");
  CHECK("transposeCharacter -1", "a|b", "ba|");
  CHECK("transposeCharacter -1", "a|bc", "ba|c");
  CHECK("transposeCharacter -1", "ab|", "ba|");
  CHECK("transposeCharacter -1", "ab|c", "ba|c");
  CHECK("transposeCharacter -1", "abc|", "acb|");

  // -2
  CHECK("transposeCharacter -2", "|", "|");
  CHECK("transposeCharacter -2", "|a", "|a");
  CHECK("transposeCharacter -2", "|ab", "ba|");
  CHECK("transposeCharacter -2", "|abc", "ba|c");
  CHECK("transposeCharacter -2", "a|", "a|");
  CHECK("transposeCharacter -2", "a|b", "ba|");
  CHECK("transposeCharacter -2", "a|bc", "ba|c");
  CHECK("transposeCharacter -2", "ab|", "ba|");
  CHECK("transposeCharacter -2", "ab|c", "ba|c");
  CHECK("transposeCharacter -2", "abc|", "bac|");

  // 1
  CHECK("transposeCharacter 1", "|", "|");
  CHECK("transposeCharacter 1", "|a", "|a");
  CHECK("transposeCharacter 1", "|ab", "ba|");
  CHECK("transposeCharacter 1", "|abc", "ba|c");
  CHECK("transposeCharacter 1", "a|", "a|");
  CHECK("transposeCharacter 1", "a|b", "ba|");
  CHECK("transposeCharacter 1", "a|bc", "acb|");
  CHECK("transposeCharacter 1", "ab|", "ba|");
  CHECK("transposeCharacter 1", "ab|c", "acb|");
  CHECK("transposeCharacter 1", "abc|", "acb|");

  // 2
  CHECK("transposeCharacter 2", "|", "|");
  CHECK("transposeCharacter 2", "|a", "|a");
  CHECK("transposeCharacter 2", "|ab", "ba|");
  CHECK("transposeCharacter 2", "|abc", "|acb");
  CHECK("transposeCharacter 2", "a|", "a|");
  CHECK("transposeCharacter 2", "a|b", "ba|");
  CHECK("transposeCharacter 2", "a|bc", "acb|");
  CHECK("transposeCharacter 2", "ab|", "ba|");
  CHECK("transposeCharacter 2", "ab|c", "acb|");
  CHECK("transposeCharacter 2", "abc|", "acb|");
}

TEST("transposePreviousCharacter")
{
  CHECK("transposePreviousCharacter", "|", "|");
  CHECK("transposePreviousCharacter", "|a", "|a");
  CHECK("transposePreviousCharacter", "|ab", "ba|");
  CHECK("transposePreviousCharacter", "|abc", "ba|c");
  CHECK("transposePreviousCharacter", "a|", "a|");
  CHECK("transposePreviousCharacter", "a|b", "ba|");
  CHECK("transposePreviousCharacter", "a|bc", "ba|c");
  CHECK("transposePreviousCharacter", "ab|", "ba|");
  CHECK("transposePreviousCharacter", "ab|c", "ba|c");
  CHECK("transposePreviousCharacter", "abc|", "acb|");
}
