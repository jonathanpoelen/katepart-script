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

function copyPreparedArguments(output, len, idxOut, input, idxIn)
{
  len += idxOut;
  for (; idxOut < len; ++idxOut, ++idxIn) {
    output[idxOut] = "'" + input[idxIn].replace('\'', '\\\'') + "'";
  }
}

function copyPreparedAnyArguments(output, len, idxOut, input, idxIn)
{
  len += idxOut;
  for (; idxOut < len; ++idxOut, ++idxIn) {
    output[idxOut] = "'" + input[idxIn].toString().replace('\'', '\\\'') + "'";
  }
}

/// args and iargs are optional
/// \return String
function prepareArguments(array, len, index, args, iargs)
{
  args = args || new Array(len);
  copyPreparedArguments(args, len, iargs | 0, array, index | 0);
  return args.join(' ');
}

function prepareCommand(cmd, array, len, index)
{
  const args = new Array(len + 1);
  args[0] = cmd;
  copyPreparedArguments(args, len, 1, array, index | 0);
  return args.join(' ');
}
