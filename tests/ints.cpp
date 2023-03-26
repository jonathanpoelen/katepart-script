/*
    SPDX-FileCopyrightText: 2023 Jonathan Poelen <jonathan.poelen+katescript@gmail.com>

    SPDX-License-Identifier: MIT
*/

#include "test.hpp"

TEST("ints")
{
  CHECK("ints 1,4", "|", "1, 2, 3, 4|");
  CHECK("ints 1,4 ''", "|", "1, 2, 3, 4|");
  CHECK("ints 1,4 '' a", "|", "1a2a3a4|");
  CHECK("ints 1,4,2 '' a", "|", "1a3|");
  CHECK("ints 1,5,2 '' a", "|", "1a3a5|");

  CHECK("ints 4", "|", "0, 1, 2, 3, 4|");
  CHECK("ints !4", "|", "0, 1, 2, 3|");
  CHECK("ints 1,!4", "|", "1, 2, 3|");
  CHECK("ints 4,1", "|", "4, 3, 2, 1|");
  CHECK("ints 4,!1", "|", "4, 3, 2|");
  CHECK("ints -1,1", "|", "-1, 0, 1|");
  CHECK("ints ,5,2", "|", "0, 2, 4|");

  // multi range
  CHECK("ints 2 -3 %c", "|", "0, 1, 2, 0, -1, -2, -3, a, b, c|");

  // base 10 and padding
  CHECK("ints 04", "|", "00, 01, 02, 03, 04|");
  CHECK("ints 01,4", "|", "01, 02, 03, 04|");
  CHECK("ints 00,!4", "|", "00, 01, 02, 03|");
  CHECK("ints 001,4", "|", "001, 002, 003, 004|");
  CHECK("ints 000,!4", "|", "000, 001, 002, 003|");
  CHECK("ints 0010,!14", "|", "0010, 0011, 0012, 0013|");
  CHECK("ints -01,2", "|", "-01, 000, 001, 002|");
  CHECK("ints -001,2", "|", "-001, 0000, 0001, 0002|");
  CHECK("ints -0010,-8", "|", "-0010, -0009, -0008|");

  // base 16 and padding
  CHECK("ints 0xc", "|", "0x0, 0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9, 0xa, 0xb, 0xc|");
  CHECK("ints 0xa,0xc", "|", "0xa, 0xb, 0xc|");
  CHECK("ints 0xa,c", "|", "0xa, 0xb, 0xc|");
  CHECK("ints 0x0a,c", "|", "0x0a, 0x0b, 0x0c|");
  CHECK("ints 0x00a,c", "|", "0x00a, 0x00b, 0x00c|");
  CHECK("ints 0x00A,c", "|", "0x00A, 0x00B, 0x00C|");
  CHECK("ints 09,11,-1", "|", "11, 10, 09|");

  // ascii
  CHECK("ints c", "|", "a, b, c|");
  CHECK("ints a,c", "|", "a, b, c|");
  CHECK("ints C", "|", "A, B, C|");
  CHECK("ints A,C", "|", "A, B, C|");
  CHECK("ints Z,a", "|", "Z, [, \\, ], ^, _, `, a|");
  CHECK("ints a,Z", "|", "a, `, _, ^, ], \\, [, Z|");

  // specify output format
  CHECK("ints %a,c", "|", "a, b, c|");
  CHECK("ints %20%aj,!b3", "|", "aj, b0, b1, b2|");
  CHECK("ints %20%%{}%aj,!b3", "|", "aj, b0, b1, b2|");
  CHECK("ints %20%%{@16}%aj,!b3", "|", "db, dc, dd, de|");
  CHECK("ints %20%%<{u@16}|{=5}>%aj,!b3", "|", "<DB| aj  >, <DC| b0  >, <DD| b1  >, <DE| b2  >|");
  CHECK("ints %20%%<{@16}|{^5}>%aj,!b3",  "|", "<db|  aj >, <dc|  b0 >, <dd|  b1 >, <de|  b2 >|");
  CHECK("ints %%%{+3}%-2,2",  "|", " -2,  -1,  +0,  +1,  +2|");
  CHECK("ints %%%{<+3}%-2,2", "|", "-2 , -1 , +0 , +1 , +2 |");
  CHECK("ints %%%{0+3}%-2,2", "|", "-02, -01, +00, +01, +02|");
  CHECK("ints %%%{@a}{u@a}%0,3", "|", "aA, bB, cC, dD|");
  CHECK("ints \"%%%'{@l}'%56,61\"", "|", "'8', '9', ':', ';', '<', '='|");
  CHECK("ints \"%%%'{@e}'%5,8\"", "|", "'0x05', '0x06', '0x07', '0x08'|");
  CHECK("ints \"%%%'{@x}'%5,8\"", "|", "'\\x05', '\\x06', '\\a', '\\b'|");
  CHECK("ints \"%%%'{u@x}'%5,8\"", "|", "'\\x05', '\\x06', '\\a', '\\b'|");
  CHECK("ints \"%%%'{u@e}'%14,14\" \"%%%'{@e}'%14,14\"", "|", "'0x0E', '0x0e'|");
  CHECK("ints \"%%%'{u@x}'%14,14\" \"%%%'{@x}'%14,14\"", "|", "'\\x0E', '\\x0e'|");

  CHECK("ints \"%%%\\n{}%1,3\" '' ''", "|", "\\n1\\n2\\n3|");
  CHECK("ints \"i%%%\\n{}%1,3\" '' ''", "|", "\n1\n2\n3|");

  CHECK("ints 1,3 change i", "a = i; a = i; a = i; a = i;|", "a = 1; a = 2; a = 3; a = 1;|");
}
