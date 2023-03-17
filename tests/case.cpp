/*
    SPDX-FileCopyrightText: 2023 Jonathan Poelen <jonathan.poelen+katescript@gmail.com>

    SPDX-License-Identifier: MIT
*/

#include "test.hpp"

TEST("camelCase")
{
  CHECKRNG("camelCase", "[aaa_bbb_ccc]", "[aaaBbbCcc]|");
  CHECKRNG("camelCase", "[aaa_bbb_ccc\n_aaa_bbb_ccc]", "[aaaBbbCcc\n_aaaBbbCcc]|");

  CHECKRNG("camelCase",
    "[aaa_bbb_ccc Aaa_bbb_ccc _aaa_bbb_ccc _Aaa_bbb_ccc __aaa_bbb_ccc __Aaa_bbb_ccc]",
    "[aaaBbbCcc aaaBbbCcc _aaaBbbCcc _aaaBbbCcc __aaaBbbCcc __aaaBbbCcc]|");

  CHECKRNG("camelCase",
    "[aaa_bbb_ccc_ Aaa_bbb_ccc_ aaa_bbb_ccc__ Aaa_bbb_ccc__]",
    "[aaaBbbCcc_ aaaBbbCcc_ aaaBbbCcc__ aaaBbbCcc__]|");

  CHECKRNG("camelCase",
    "[1aaa_bbb_ccc 1Aaa_bbb_ccc _1aaa_bbb_ccc _1Aaa_bbb_ccc __1aaa_bbb_ccc __1Aaa_bbb_ccc]",
    "[1AaaBbbCcc 1AaaBbbCcc _1AaaBbbCcc _1AaaBbbCcc __1AaaBbbCcc __1AaaBbbCcc]|");

  CHECKRNG("camelCase",
    "[12aaa_bbb_ccc 12Aaa_bbb_ccc _12aaa_bbb_ccc _12Aaa_bbb_ccc __12aaa_bbb_ccc __12Aaa_bbb_ccc]",
    "[12AaaBbbCcc 12AaaBbbCcc _12AaaBbbCcc _12AaaBbbCcc __12AaaBbbCcc __12AaaBbbCcc]|");

  CHECKRNG("camelCase",
    "[aaa_1bbb_ccc aaa_12bbb_ccc aaa1bbb aaa12bbb]",
    "[aaa1BbbCcc aaa12BbbCcc aaa1Bbb aaa12Bbb]|");

  CHECK("camelCase", "aaa_bbb_ccc|", "aaaBbbCcc|");
  CHECK("camelCase", "aaa_bbb_|ccc", "aaaBbbCcc|");
  CHECK("camelCase", "|aaa_bbb_ccc", "aaaBbbCcc|");

  CHECK("camelCase", " aaa_bbb_ccc| ", " aaaBbbCcc| ");
  CHECK("camelCase", " aaa_bbb_|ccc ", " aaaBbbCcc| ");
  CHECK("camelCase", " |aaa_bbb_ccc ", " aaaBbbCcc| ");

  CHECK("camelCase", "xxx aaa_bbb_ccc| yyy", "xxx aaaBbbCcc| yyy");
  CHECK("camelCase", "xxx aaa_bbb_|ccc yyy", "xxx aaaBbbCcc| yyy");
  CHECK("camelCase", "xxx |aaa_bbb_ccc yyy", "xxx aaaBbbCcc| yyy");

  CHECK("camelCase", "xxx | aaa_bbb_ccc", "xxx  aaaBbbCcc|");
}

TEST("camelCase-")
{
  CHECKRNG("camelCase-", "[aaa_bbb-ccc]", "[aaaBbbCcc]|");
  CHECKRNG("camelCase-", "[aaa_bbb_ccc\n_aaa-bbb_ccc]", "[aaaBbbCcc\n_aaaBbbCcc]|");

  CHECK("camelCase-", "aaa_bbb-ccc|", "aaaBbbCcc|");
}

TEST("pascalCase")
{
  CHECKRNG("pascalCase", "[aaa_bbb_ccc]", "[AaaBbbCcc]|");
  CHECKRNG("pascalCase", "[aaaBbbCcc]", "[AaaBbbCcc]|");
  CHECKRNG("pascalCase", "[aaa_bbb_ccc\n_aaa_bbb_ccc]", "[AaaBbbCcc\n_AaaBbbCcc]|");

  CHECKRNG("pascalCase",
    "[aaa_bbb_ccc Aaa_bbb_ccc _aaa_bbb_ccc _Aaa_bbb_ccc __aaa_bbb_ccc __Aaa_bbb_ccc]",
    "[AaaBbbCcc AaaBbbCcc _AaaBbbCcc _AaaBbbCcc __AaaBbbCcc __AaaBbbCcc]|");

  CHECKRNG("pascalCase",
    "[aaa_bbb_ccc_ Aaa_bbb_ccc_ aaa_bbb_ccc__ Aaa_bbb_ccc__]",
    "[AaaBbbCcc_ AaaBbbCcc_ AaaBbbCcc__ AaaBbbCcc__]|");

  CHECKRNG("pascalCase",
    "[1aaa_bbb_ccc 1Aaa_bbb_ccc _1aaa_bbb_ccc _1Aaa_bbb_ccc __1aaa_bbb_ccc __1Aaa_bbb_ccc]",
    "[1AaaBbbCcc 1AaaBbbCcc _1AaaBbbCcc _1AaaBbbCcc __1AaaBbbCcc __1AaaBbbCcc]|");

  CHECKRNG("pascalCase",
    "[12aaa_bbb_ccc 12Aaa_bbb_ccc _12aaa_bbb_ccc _12Aaa_bbb_ccc __12aaa_bbb_ccc __12Aaa_bbb_ccc]",
    "[12AaaBbbCcc 12AaaBbbCcc _12AaaBbbCcc _12AaaBbbCcc __12AaaBbbCcc __12AaaBbbCcc]|");

  CHECKRNG("pascalCase",
    "[aaa_1bbb_ccc aaa_12bbb_ccc aaa1bbb aaa12bbb]",
    "[Aaa1BbbCcc Aaa12BbbCcc Aaa1Bbb Aaa12Bbb]|");

  CHECK("pascalCase", "aaa_bbb_ccc|", "AaaBbbCcc|");
  CHECK("pascalCase", "aaa_bbb_|ccc", "AaaBbbCcc|");
  CHECK("pascalCase", "|aaa_bbb_ccc", "AaaBbbCcc|");

  CHECK("pascalCase", " aaa_bbb_ccc| ", " AaaBbbCcc| ");
  CHECK("pascalCase", " aaa_bbb_|ccc ", " AaaBbbCcc| ");
  CHECK("pascalCase", " |aaa_bbb_ccc ", " AaaBbbCcc| ");

  CHECK("pascalCase", "xxx aaa_bbb_ccc| yyy", "xxx AaaBbbCcc| yyy");
  CHECK("pascalCase", "xxx aaa_bbb_|ccc yyy", "xxx AaaBbbCcc| yyy");
  CHECK("pascalCase", "xxx |aaa_bbb_ccc yyy", "xxx AaaBbbCcc| yyy");

  CHECK("pascalCase", "xxx | aaa_bbb_ccc", "xxx  AaaBbbCcc|");
}

TEST("pascalCase-")
{
  CHECKRNG("pascalCase-", "[aaa_bbb-ccc]", "[AaaBbbCcc]|");
  CHECKRNG("pascalCase-", "[aaaBbbCcc]", "[AaaBbbCcc]|");
  CHECKRNG("pascalCase-", "[aaa_bbb-ccc\n_aaa-bbb_ccc]", "[AaaBbbCcc\n_AaaBbbCcc]|");

  CHECK("pascalCase-", "aaa_bbb-ccc|", "AaaBbbCcc|");
}

TEST("snakeCase")
{
  CHECKRNG("snakeCase", "[AaaBbbCcc]", "[aaa_bbb_ccc]|");
  CHECKRNG("snakeCase -", "[AaaBbbCcc]", "[aaa-bbb-ccc]|");
  CHECKRNG("snakeCase", "[AaaBbbCcc\n_AaaBbbCcc]", "[aaa_bbb_ccc\n_aaa_bbb_ccc]|");

  CHECKRNG("snakeCase",
    "[aaa_bbb_ccc aaaBbbCcc _aaaBbbCcc __aaaBbbCcc aaaBbbCcc_ aaaBbbCcc__]",
    "[aaa_bbb_ccc aaa_bbb_ccc _aaa_bbb_ccc __aaa_bbb_ccc aaa_bbb_ccc_ aaa_bbb_ccc__]|");

  CHECKRNG("snakeCase",
    "[Aaa_Bbb_Ccc AaaBbbCcc _AaaBbbCcc __AaaBbbCcc AaaBbbCcc_ AaaBbbCcc__]",
    "[aaa_bbb_ccc aaa_bbb_ccc _aaa_bbb_ccc __aaa_bbb_ccc aaa_bbb_ccc_ aaa_bbb_ccc__]|");

  CHECKRNG("snakeCase",
    "[1AaaBbbCcc _1AaaBbbCcc Aaa1BbbCcc _Aaa1BbbCcc]",
    "[1aaa_bbb_ccc _1aaa_bbb_ccc aaa1bbb_ccc _aaa1bbb_ccc]|");

  CHECKRNG("snakeCase",
    "[12AaaBbbCcc _12AaaBbbCcc Aaa12BbbCcc _Aaa12BbbCcc]",
    "[12aaa_bbb_ccc _12aaa_bbb_ccc aaa12bbb_ccc _aaa12bbb_ccc]|");

  CHECK("snakeCase", "xxx AaaBbb|Ccc yyy", "xxx aaa_bbb_ccc| yyy");
}

TEST("snakeCase-")
{
  CHECKRNG("snakeCase-", "[AaaBbb-ccc]", "[aaa_bbb_ccc]|");
  CHECKRNG("snakeCase- /", "[AaaBbb-ccc]", "[aaa/bbb/ccc]|");
  CHECKRNG("snakeCase-", "[AaaBbb-Ccc\n_Aaa-BbbCcc]", "[aaa_bbb_ccc\n_aaa_bbb_ccc]|");

  CHECK("snakeCase-", "xxx Aaa-Bbb|Ccc yyy", "xxx aaa_bbb_ccc| yyy");
}

TEST("snakeCase/_d")
{
  CHECKRNG("snakeCase/_d", "[AaaBbbCcc]", "[aaa_bbb_ccc]|");
  CHECKRNG("snakeCase/_d -", "[AaaBbbCcc]", "[aaa-bbb-ccc]|");
  CHECKRNG("snakeCase/_d", "[AaaBbbCcc\n_AaaBbbCcc]", "[aaa_bbb_ccc\n_aaa_bbb_ccc]|");

  CHECKRNG("snakeCase/_d",
    "[aaa_bbb_ccc aaaBbbCcc _aaaBbbCcc __aaaBbbCcc aaaBbbCcc_ aaaBbbCcc__]",
    "[aaa_bbb_ccc aaa_bbb_ccc _aaa_bbb_ccc __aaa_bbb_ccc aaa_bbb_ccc_ aaa_bbb_ccc__]|");

  CHECKRNG("snakeCase/_d",
    "[Aaa_Bbb_Ccc AaaBbbCcc _AaaBbbCcc __AaaBbbCcc AaaBbbCcc_ AaaBbbCcc__]",
    "[aaa_bbb_ccc aaa_bbb_ccc _aaa_bbb_ccc __aaa_bbb_ccc aaa_bbb_ccc_ aaa_bbb_ccc__]|");

  CHECKRNG("snakeCase/_d",
    "[1AaaBbbCcc _1AaaBbbCcc Aaa1BbbCcc _Aaa1BbbCcc]",
    "[1aaa_bbb_ccc _1aaa_bbb_ccc aaa_1bbb_ccc _aaa_1bbb_ccc]|");

  CHECKRNG("snakeCase/_d",
    "[12AaaBbbCcc _12AaaBbbCcc Aaa12BbbCcc _Aaa12BbbCcc]",
    "[12aaa_bbb_ccc _12aaa_bbb_ccc aaa_12bbb_ccc _aaa_12bbb_ccc]|");

  CHECK("snakeCase/_d", "xxx AaaBbb|Ccc yyy", "xxx aaa_bbb_ccc| yyy");
}

TEST("snakeCase-/_d")
{
  CHECKRNG("snakeCase-/_d", "[AaaBbb-Ccc]", "[aaa_bbb_ccc]|");

  CHECK("snakeCase-/_d", "xxx Aaa-Bbb|Ccc yyy", "xxx aaa_bbb_ccc| yyy");
}

TEST("snakeCase/d_")
{
  CHECKRNG("snakeCase/d_", "[AaaBbbCcc]", "[aaa_bbb_ccc]|");
  CHECKRNG("snakeCase/d_ -", "[AaaBbbCcc]", "[aaa-bbb-ccc]|");
  CHECKRNG("snakeCase/d_", "[AaaBbbCcc\n_AaaBbbCcc]", "[aaa_bbb_ccc\n_aaa_bbb_ccc]|");

  CHECKRNG("snakeCase/d_",
    "[aaa_bbb_ccc aaaBbbCcc _aaaBbbCcc __aaaBbbCcc aaaBbbCcc_ aaaBbbCcc__]",
    "[aaa_bbb_ccc aaa_bbb_ccc _aaa_bbb_ccc __aaa_bbb_ccc aaa_bbb_ccc_ aaa_bbb_ccc__]|");

  CHECKRNG("snakeCase/d_",
    "[Aaa_Bbb_Ccc AaaBbbCcc _AaaBbbCcc __AaaBbbCcc AaaBbbCcc_ AaaBbbCcc__]",
    "[aaa_bbb_ccc aaa_bbb_ccc _aaa_bbb_ccc __aaa_bbb_ccc aaa_bbb_ccc_ aaa_bbb_ccc__]|");

  CHECKRNG("snakeCase/d_",
    "[1AaaBbbCcc _1AaaBbbCcc Aaa1BbbCcc _Aaa1BbbCcc]",
    "[1_aaa_bbb_ccc _1_aaa_bbb_ccc aaa1_bbb_ccc _aaa1_bbb_ccc]|");

  CHECKRNG("snakeCase/d_",
    "[12AaaBbbCcc _12AaaBbbCcc Aaa12BbbCcc _Aaa12BbbCcc]",
    "[12_aaa_bbb_ccc _12_aaa_bbb_ccc aaa12_bbb_ccc _aaa12_bbb_ccc]|");

  CHECK("snakeCase/d_", "xxx AaaBbb|Ccc yyy", "xxx aaa_bbb_ccc| yyy");
}

TEST("snakeCase-/d_")
{
  CHECKRNG("snakeCase-/d_", "[AaaBbb-Ccc]", "[aaa_bbb_ccc]|");

  CHECK("snakeCase-/d_", "xxx Aaa-Bbb|Ccc yyy", "xxx aaa_bbb_ccc| yyy");
}

TEST("snakeCase/_d_")
{
  CHECKRNG("snakeCase/_d_", "[AaaBbbCcc]", "[aaa_bbb_ccc]|");
  CHECKRNG("snakeCase/_d_ -", "[AaaBbbCcc]", "[aaa-bbb-ccc]|");
  CHECKRNG("snakeCase/_d_", "[AaaBbbCcc\n_AaaBbbCcc]", "[aaa_bbb_ccc\n_aaa_bbb_ccc]|");

  CHECKRNG("snakeCase/_d_",
    "[aaa_bbb_ccc aaaBbbCcc _aaaBbbCcc __aaaBbbCcc aaaBbbCcc_ aaaBbbCcc__]",
    "[aaa_bbb_ccc aaa_bbb_ccc _aaa_bbb_ccc __aaa_bbb_ccc aaa_bbb_ccc_ aaa_bbb_ccc__]|");

  CHECKRNG("snakeCase/_d_",
    "[Aaa_Bbb_Ccc AaaBbbCcc _AaaBbbCcc __AaaBbbCcc AaaBbbCcc_ AaaBbbCcc__]",
    "[aaa_bbb_ccc aaa_bbb_ccc _aaa_bbb_ccc __aaa_bbb_ccc aaa_bbb_ccc_ aaa_bbb_ccc__]|");

  CHECKRNG("snakeCase/_d_",
    "[1AaaBbbCcc _1AaaBbbCcc Aaa1BbbCcc _Aaa1BbbCcc]",
    "[1_aaa_bbb_ccc _1_aaa_bbb_ccc aaa_1_bbb_ccc _aaa_1_bbb_ccc]|");

  CHECKRNG("snakeCase/_d_",
    "[12AaaBbbCcc _12AaaBbbCcc Aaa12BbbCcc _Aaa12BbbCcc]",
    "[12_aaa_bbb_ccc _12_aaa_bbb_ccc aaa_12_bbb_ccc _aaa_12_bbb_ccc]|");

  CHECK("snakeCase/_d_", "xxx AaaBbb|Ccc yyy", "xxx aaa_bbb_ccc| yyy");
}

TEST("snakeCase-/_d_")
{
  CHECKRNG("snakeCase-/_d_", "[AaaBbb-Ccc]", "[aaa_bbb_ccc]|");

  CHECK("snakeCase-/_d_", "xxx Aaa-Bbb|Ccc yyy", "xxx aaa_bbb_ccc| yyy");
}

TEST("dashedCase")
{
  CHECKRNG("dashedCase", "[aaa_bbb_ccc]", "[aaa-bbb-ccc]|");
}

TEST("dashedCaseToCamelCase")
{
  CHECKRNG("dashedCaseToCamelCase", "[aaa_bbb_ccc]", "[aaaBbbCcc]|");
  CHECKRNG("dashedCaseToCamelCase", "[aaa-bbb-ccc]", "[aaaBbbCcc]|");
  CHECKRNG("dashedCaseToCamelCase", "[aaa_bbb_ccc\n_aaa-bbb-ccc]", "[aaaBbbCcc\n_aaaBbbCcc]|");

  CHECKRNG("dashedCaseToCamelCase",
    "[aaa-bbb-ccc Aaa-bbb-ccc -aaa-bbb-ccc -Aaa-bbb-ccc --aaa-bbb-ccc --Aaa-bbb-ccc]",
    "[aaaBbbCcc aaaBbbCcc _aaaBbbCcc _aaaBbbCcc __aaaBbbCcc __aaaBbbCcc]|");

  CHECKRNG("dashedCaseToCamelCase",
    "[aaa-bbb-ccc- Aaa-bbb-ccc- aaa-bbb-ccc-- Aaa-bbb-ccc--]",
    "[aaaBbbCcc_ aaaBbbCcc_ aaaBbbCcc__ aaaBbbCcc__]|");

  CHECKRNG("dashedCaseToCamelCase",
    "[1aaa-bbb-ccc 1Aaa-bbb-ccc -1aaa-bbb-ccc -1Aaa-bbb-ccc --1aaa-bbb-ccc --1Aaa-bbb-ccc]",
    "[1AaaBbbCcc 1AaaBbbCcc _1AaaBbbCcc _1AaaBbbCcc __1AaaBbbCcc __1AaaBbbCcc]|");

  CHECKRNG("dashedCaseToCamelCase",
    "[12aaa-bbb-ccc 12Aaa-bbb-ccc -12aaa-bbb-ccc -12Aaa-bbb-ccc --12aaa-bbb-ccc --12Aaa-bbb-ccc]",
    "[12AaaBbbCcc 12AaaBbbCcc _12AaaBbbCcc _12AaaBbbCcc __12AaaBbbCcc __12AaaBbbCcc]|");

  CHECKRNG("dashedCaseToCamelCase",
    "[aaa-1bbb-ccc aaa-12bbb-ccc aaa1bbb aaa12bbb - -_- --_]",
    "[aaa1BbbCcc aaa12BbbCcc aaa1Bbb aaa12Bbb - -_- --_]|");

  CHECK("dashedCaseToCamelCase", "aaa-bbb-ccc|", "aaaBbbCcc|");
  CHECK("dashedCaseToCamelCase", "aaa-bbb-|ccc", "aaaBbbCcc|");
  CHECK("dashedCaseToCamelCase", "|aaa-bbb-ccc", "aaaBbbCcc|");

  CHECK("dashedCaseToCamelCase", " aaa-bbb-ccc| ", " aaaBbbCcc| ");
  CHECK("dashedCaseToCamelCase", " aaa-bbb-|ccc ", " aaaBbbCcc| ");
  CHECK("dashedCaseToCamelCase", " |aaa-bbb-ccc ", " aaaBbbCcc| ");

  CHECK("dashedCaseToCamelCase", "xxx aaa-bbb-ccc| yyy", "xxx aaaBbbCcc| yyy");
  CHECK("dashedCaseToCamelCase", "xxx aaa-bbb-|ccc yyy", "xxx aaaBbbCcc| yyy");
  CHECK("dashedCaseToCamelCase", "xxx |aaa-bbb-ccc yyy", "xxx aaaBbbCcc| yyy");

  CHECK("dashedCaseToCamelCase", "xxx | aaa-bbb-ccc", "xxx  aaaBbbCcc|");
}

TEST("dashedCaseToPascalCase")
{
  CHECKRNG("dashedCaseToPascalCase", "[aaa-bbb-ccc]", "[AaaBbbCcc]|");
  CHECKRNG("dashedCaseToPascalCase", "[aaaBbbCcc]", "[AaaBbbCcc]|");
  CHECKRNG("dashedCaseToPascalCase", "[aaa-bbb-ccc\n-aaa_bbb_ccc]", "[AaaBbbCcc\n_AaaBbbCcc]|");

  CHECKRNG("dashedCaseToPascalCase",
    "[aaa-bbb-ccc Aaa-bbb-ccc -aaa-bbb-ccc -Aaa-bbb-ccc --aaa-bbb-ccc --Aaa-bbb-ccc]",
    "[AaaBbbCcc AaaBbbCcc _AaaBbbCcc _AaaBbbCcc __AaaBbbCcc __AaaBbbCcc]|");

  CHECKRNG("dashedCaseToPascalCase",
    "[aaa-bbb-ccc- Aaa-bbb-ccc- aaa-bbb-ccc-- Aaa-bbb-ccc--]",
    "[AaaBbbCcc_ AaaBbbCcc_ AaaBbbCcc__ AaaBbbCcc__]|");

  CHECKRNG("dashedCaseToPascalCase",
    "[1aaa-bbb-ccc 1Aaa-bbb-ccc -1aaa-bbb-ccc -1Aaa-bbb-ccc --1aaa-bbb-ccc --1Aaa-bbb-ccc]",
    "[1AaaBbbCcc 1AaaBbbCcc _1AaaBbbCcc _1AaaBbbCcc __1AaaBbbCcc __1AaaBbbCcc]|");

  CHECKRNG("dashedCaseToPascalCase",
    "[12aaa-bbb-ccc 12Aaa-bbb-ccc -12aaa-bbb-ccc -12Aaa-bbb-ccc --12aaa-bbb-ccc --12Aaa-bbb-ccc]",
    "[12AaaBbbCcc 12AaaBbbCcc _12AaaBbbCcc _12AaaBbbCcc __12AaaBbbCcc __12AaaBbbCcc]|");

  CHECKRNG("dashedCaseToPascalCase",
    "[aaa-1bbb-ccc aaa-12bbb-ccc aaa1bbb aaa12bbb - -_- --_]",
    "[Aaa1BbbCcc Aaa12BbbCcc Aaa1Bbb Aaa12Bbb - -_- --_]|");

  CHECK("dashedCaseToPascalCase", "aaa-bbb-ccc|", "AaaBbbCcc|");
  CHECK("dashedCaseToPascalCase", "aaa-bbb-|ccc", "AaaBbbCcc|");
  CHECK("dashedCaseToPascalCase", "|aaa-bbb-ccc", "AaaBbbCcc|");

  CHECK("dashedCaseToPascalCase", " aaa-bbb-ccc| ", " AaaBbbCcc| ");
  CHECK("dashedCaseToPascalCase", " aaa-bbb-|ccc ", " AaaBbbCcc| ");
  CHECK("dashedCaseToPascalCase", " |aaa-bbb-ccc ", " AaaBbbCcc| ");

  CHECK("dashedCaseToPascalCase", "xxx aaa-bbb-ccc| yyy", "xxx AaaBbbCcc| yyy");
  CHECK("dashedCaseToPascalCase", "xxx aaa-bbb-|ccc yyy", "xxx AaaBbbCcc| yyy");
  CHECK("dashedCaseToPascalCase", "xxx |aaa_bbb_ccc yyy", "xxx AaaBbbCcc| yyy");

  CHECK("dashedCaseToPascalCase", "xxx | aaa-bbb-ccc", "xxx  AaaBbbCcc|");
}

TEST("dashedCaseToSnakeCase")
{
  CHECKRNG("dashedCaseToSnakeCase", "[aaa-bbb-ccc]", "[aaa_bbb_ccc]|");
  CHECKRNG("dashedCaseToSnakeCase -", "[aaa-bbb-ccc]", "[aaa-bbb-ccc]|");
  CHECKRNG("dashedCaseToSnakeCase", "[aaa-bbb-ccc\n_aaa-bbb-ccc]", "[aaa_bbb_ccc\n_aaa_bbb_ccc]|");

  CHECKRNG("dashedCaseToSnakeCase",
    "[aaa-bbb-ccc -aaa-bbb-ccc --aaa-bbb-ccc aaa-bbb-ccc- aaa-bbb-ccc--]",
    "[aaa_bbb_ccc _aaa_bbb_ccc __aaa_bbb_ccc aaa_bbb_ccc_ aaa_bbb_ccc__]|");

  CHECKRNG("dashedCaseToSnakeCase",
    "[Aaa-Bbb-Ccc aaa-bbb-ccc -aaa-bbb-ccc --aaa-bbb-ccc aaa-bbb-ccc- aaa-bbb-ccc--]",
    "[Aaa_Bbb_Ccc aaa_bbb_ccc _aaa_bbb_ccc __aaa_bbb_ccc aaa_bbb_ccc_ aaa_bbb_ccc__]|");

  CHECKRNG("dashedCaseToSnakeCase",
    "[1aaa-bbb-ccc -1aaa-bbb-ccc Aaa1-Bbb-Ccc -Aaa1_Bbb-Ccc - -_- --_]",
    "[1aaa_bbb_ccc _1aaa_bbb_ccc Aaa1_Bbb_Ccc _Aaa1_Bbb_Ccc - -_- --_]|");

  CHECK("dashedCaseToSnakeCase", "xxx aaa-bbb|-ccc yyy", "xxx aaa_bbb_ccc| yyy");
}

TEST("reverseCase")
{
  CHECKRNG("reverseCase", "[aaa_BBB_ccc]", "[AAA_bbb_CCC]|");
  CHECKRNG("reverseCase", "[aaa_BBB_ccc\n_aaa_BBB_ccc]", "[AAA_bbb_CCC\n_AAA_bbb_CCC]|");

  CHECK("reverseCase", "xxx AAA_bbb|_CCC yyy", "xxx aaa_BBB_ccc| yyy");
}

TEST("reverseCase-")
{
  CHECKRNG("reverseCase-", "[aaa_BBB-ccc]", "[AAA_bbb-CCC]|");

  CHECK("reverseCase-", "xxx AAA-bbb|_CCC yyy", "xxx aaa-BBB_ccc| yyy");
}
