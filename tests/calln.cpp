/*
    SPDX-FileCopyrightText: 2023 Jonathan Poelen <jonathan.poelen+katescript@gmail.com>

    SPDX-License-Identifier: MIT
*/

#include "test.hpp"

TEST("calln")
{
  CHECK("calln 2 duplicateLinesUp duplicateLinesDown",
    "line|", "line\nline\nline|\nline\nline");
  CHECK("calln 2 'duplicate -1' 'duplicate 1'",
    "line|", "line\nline\nline|\nline\nline");
  CHECK("callns 2 ; duplicateLinesUp ; duplicateLinesDown",
    "line|", "line\nline\nline|\nline\nline");
  CHECK("callns 2 ; duplicate -1 ; duplicate 1",
    "line|", "line\nline\nline|\nline\nline");
}
