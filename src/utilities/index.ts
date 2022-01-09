import { promisify } from "util";

export const sleep = promisify(setTimeout);

export function getEnvironmentVariable(name: string, defaultValue?: string): string {
  if (process.env[name] !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return process.env[name]!;
  } else {
    if (!!defaultValue) {
      return defaultValue;
    }
    throw new Error(`Missing ${name} environment variable`);
  }
}
