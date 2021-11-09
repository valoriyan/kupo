import { promisify } from "util";

export const sleep = promisify(setTimeout);

export function getEnvironmentVariable(name: string): string {
  if (!!process.env[name]) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return process.env[name]!;
  } else {
    throw new Error(`Missing ${name} environment variable`);
  }
}
