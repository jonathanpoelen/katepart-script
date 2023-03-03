/*
    SPDX-FileCopyrightText: 2023 Jonathan Poelen <jonathan.poelen+katescript@gmail.com>

    SPDX-License-Identifier: BSD
*/

function executeCommand(cmd)
{
  const result = view.executeCommand(cmd);
  if (result) {
    debug(result.status);
  }
}

/// args and iargs are optional
/// \return String
function prepareArguments(array, len, index, args, iargs)
{
  args = args || new Array(len);
  let j = index | 0;
  let i = iargs | 0;
  len += i;
  for (; i < len; ++i, ++j) {
    args[i] = "'" + array[j].replace('\'', '\\\'') + "'";
  }
  return args.join(' ');
}

function prepareCommand(cmd, array, len, index)
{
  const args = new Array(len + 1);
  args[0] = cmd;
  return prepareArguments(array, len, index, args, 1);
}
