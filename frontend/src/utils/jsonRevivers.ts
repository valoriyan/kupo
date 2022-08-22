export function jsonDateReviver(this: unknown, key: string, value: unknown) {
  // plug this regex into regex101.com to understand how it works
  // matches 2019-06-20T12:29:43.288Z (with milliseconds) and 2019-06-20T12:29:43Z (without milliseconds)
  const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,}|)Z$/;

  if (typeof value === "string" && dateFormat.test(value)) {
    return new Date(value);
  }

  return value;
}
