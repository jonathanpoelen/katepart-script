function indentationText(line)
{
  const firstColumn = document.firstColumn(line);
  return (firstColumn === - 1) ? "" : document.text(line, 0, line, firstColumn);
}
