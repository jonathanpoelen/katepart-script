/*
    SPDX-FileCopyrightText: 2023 Jonathan Poelen <jonathan.poelen+katescript@gmail.com>

    SPDX-License-Identifier: BSD
*/

BracketMap = (function() {
  const bo0 = [0,  1, '('];
  const bc0 = [0, -1, ')'];
  const bo1 = [1,  1, '['];
  const bc1 = [1, -1, ']'];
  const bo2 = [2,  1, '{'];
  const bc2 = [2, -1, '}'];
  const bo3 = [3,  1, '<'];
  const bc3 = [3, -1, '>'];
  const bracketMap1 = {
    '(': bo0, ')': bc0,
    '[': bo1, ']': bc1,
    '{': bo2, '}': bc2,
  };
  const bracketMap2 = {
    '(': bo0, ')': bc0,
    '[': bo1, ']': bc1,
    '{': bo2, '}': bc2,
    '<': bo3, '>': bc3,
  };

  const defaultEnclosing1 = '([{}])';
  const defaultEnclosing2 = '([{}])<>';
  const defaultEnclosing2bis = '([{}])<';

  return {
    bracketMap1,
    bracketMap2,
    defaultEnclosing1,
    defaultEnclosing2,

    /// \return {char: [bracketIndex, increment, reverseChar]}
    makeBracketMap: function(enclosing)
    {
      // fast path
      if (!enclosing || enclosing === defaultEnclosing1) {
        return bracketMap1;
      }

      if (enclosing === defaultEnclosing2 || enclosing === defaultEnclosing2bis) {
        return bracketMap2;
      }

      const bracketMap = {};
      for (let i = 0; i < enclosing.length; ++i) {
        const c = enclosing[i];
        if (c === '(' || c === ')')
        {
            bracketMap['('] = bo0;
            bracketMap[')'] = bc0;
        }
        else if (c === '[' || c === ']')
        {
          bracketMap['['] = bo1;
          bracketMap[']'] = bc1;
        }
        else if (c === '{' || c === '}')
        {
          bracketMap['{'] = bo2;
          bracketMap['}'] = bc2;
        }
        else if (c === '<' || c === '>')
        {
          bracketMap['<'] = bo3;
          bracketMap['>'] = bc3;
        }
      }

      return bracketMap;
    }
  };
})();
