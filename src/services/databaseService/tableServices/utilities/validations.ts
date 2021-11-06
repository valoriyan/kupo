// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function assertIsNumber(number: any): void {
  if (isNaN(number)) {
    throw new Error(`'${number}' is not a valid number.`);
  }

  return;
}
