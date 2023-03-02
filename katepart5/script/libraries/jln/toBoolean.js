function toBoolean(value)
{
  if (!value) return false;
  if (+value) return true;
  if (value === 'y') return true;
  if (value === 'on') return true;
  if (value === 'true') return true;
  return false;
}
