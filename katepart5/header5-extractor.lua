#!/usr/bin/env lua

argc=table.getn(arg)
if argc < 2 then
  io.stderr:write(arg[0] .. ' revision-number command.js...\n')
  os.exit(1)
end

function readHeader(fileName)
  local f,e = io.open(fileName)
  if not f then
    io.stderr:write(err..'\n')
    os.exit(2)
  end

  f:read() -- ignore first line: `var katescript = `

  local header = ''
  for line in f:lines() do
    if line == '};' then
      break
    end
    header = header .. line
  end

  return header
end

header = '['
for i=2, argc do
  header = header .. '{' .. readHeader(arg[i]) .. '},'
end

json=require('json')
headers = json.decode(header .. ']')

root_funcs = headers[1]['functions']
root_acts = headers[1]['actions']
for k=2,#headers do
  h = headers[k]['functions']
  for i=1,#h do
    root_funcs[#root_funcs+1] = h[i]
  end
  h = headers[k]['actions']
  for i=1,#h do
    root_acts[#root_acts+1] = h[i]
  end
end

headers[1]['revision'] = arg[1]+0

print('var katescript = ')
print(json.encode(headers[1]))
print('};')
