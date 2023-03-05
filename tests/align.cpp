/*
    SPDX-FileCopyrightText: 2023 Jonathan Poelen <jonathan.poelen+katescript@gmail.com>

    SPDX-License-Identifier: MIT
*/

#include "test.hpp"

TEST("align")
{
  CHECKRNG("align",
    "\n["
    "abc def ghi\n"
    "abc   def   ghi\n"
    "abc def  ghi\n"
    " abc def  ghi]\n"
    ,
    "\n["
    " abc   def   ghi\n"
    " abc   def   ghi\n"
    " abc   def   ghi\n"
    " abc   def   ghi]|\n"
  );

  CHECKRNG("align \\\\s+",
    "\n["
    "abcabc def ghi\n"
    "abcbc def ghi\n"
    "abc defdef ghi\n"
    " abc def ghi]\n"
    ,
    "\n["
    "abcabc def    ghi\n"
    "abcbc  def    ghi\n"
    "abc    defdef ghi\n"
    "       abc    def ghi]|\n"
  );

  CHECKRNG("align",
    "\n["
    "abc def ghi\n"
    "abc   def\n"
    "abc def  ghi\n"
    " abc def  ghi]\n"
    ,
    "\n["
    " abc   def  ghi\n"
    " abc   def\n"
    " abc   def  ghi\n"
    " abc   def  ghi]|\n"
  );

  CHECKRNG("align",
    "\n["
    "bc def ghi\n"
    "abc   def\n"
    "abc f  ghi\n"
    " abc def  ghi]\n"
    ,
    "\n["
    " bc    def  ghi\n"
    " abc   def\n"
    " abc   f    ghi\n"
    " abc   def  ghi]|\n"
  );

  CHECKRNG("align ,",
    "\n["
    "bc, def, ghi\n"
    "abc,   def\n"
    "abc, f,  ghi\n"
    " abc, def, ghi]\n"
    ,
    "\n["
    "bc  , def, ghi\n"
    "abc ,   def\n"
    "abc , f  ,  ghi\n"
    " abc, def, ghi]|\n"
  );

  CHECKRNG("align , '' 1",
    "\n["
    "bc, def, ghi\n"
    "abc,   def\n"
    "abc, f,  ghi\n"
    " abc, def, ghi]\n"
    ,
    "\n["
    "bc,   def, ghi\n"
    "abc,    def\n"
    "abc,  f,    ghi\n"
    " abc, def, ghi]|\n"
  );

  // same
  CHECKRNG("align/a ,",
    "\n["
    "bc, def, ghi\n"
    "abc,   def\n"
    "abc, f,  ghi\n"
    " abc, def, ghi]\n"
    ,
    "\n["
    "bc,   def, ghi\n"
    "abc,    def\n"
    "abc,  f,    ghi\n"
    " abc, def, ghi]|\n"
  );

  CHECKRNG("align ;(,); _",
    "\n["
    "bc, def;,;ghi\n"
    "abc ;,;   def]\n"
    ,
    "\n["
    "bc, def;,;ghi\n"
    "abc ;___,;   def]|\n"
  );

  CHECKRNG("align ,|^",
    "\n"
    "foo([def, ghi, \n"
    "abc, def, ghi)]\n"
    ,
    "\n"
    "foo([def, ghi, \n"
    "    abc, def, ghi)]|\n"
  );
}
