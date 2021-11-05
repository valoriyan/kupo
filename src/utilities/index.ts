import { DateTime } from "luxon";

export function getEnvironmentVariable(name: string): string {
  if (!!process.env[name]) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return process.env[name]!;
  } else {
    throw new Error(`Missing ${name} environment variable`);
  }
}

export function getTimestampRangeFromJSMonth({
  year,
  month,
  timeZone,
}: {
  year: number;
  month: number;
  timeZone: string;
}): {
  lowerTimestamp: number;
  upperTimestamp: number;
} {
  const lowerDate = DateTime.fromObject({ year, month: month + 1 }, { zone: timeZone });

  const upperDate = lowerDate.plus({ months: 1 });

  const lowerTimestamp = lowerDate.toMillis();
  const upperTimestamp = upperDate.toMillis();

  return {
    lowerTimestamp,
    upperTimestamp,
  };
}
