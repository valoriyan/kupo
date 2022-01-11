import { DateTime, DurationUnit } from "luxon";

const units: DurationUnit[] = [
  "year",
  "month",
  "week",
  "day",
  "hour",
  "minute",
  "second",
];

const unitToShortUnit: Record<string, string> = {
  // month and year are omitted because that's how Instagram does it
  week: "w",
  day: "d",
  hour: "h",
  minute: "m",
  second: "s",
};

// Converts a JS timestamp to a string like "3 hours ago" or "12 years ago"
export function getRelativeTimestamp(timestamp: number): string {
  const dateTime = DateTime.fromMillis(timestamp);
  const diff = dateTime.diffNow().shiftTo(...units);
  const unit = units.find((unit) => diff.get(unit) !== 0) || "second";

  const relativeFormatter = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });
  return relativeFormatter.format(
    Math.trunc(diff.as(unit)),
    unit as Intl.RelativeTimeFormatUnit,
  );
}

// Converts a JS timestamp to a string like "3h" or "12y"
export function getShortRelativeTimestamp(timestamp: number): string {
  const dateTime = DateTime.fromMillis(timestamp);
  const diff = dateTime
    .diffNow()
    .shiftTo(...(Object.keys(unitToShortUnit) as DurationUnit[]));
  const unit = units.find((unit) => diff.get(unit) !== 0) || "second";

  // TODO: support i18n
  return `${Math.abs(Math.trunc(diff.as(unit)))}${unitToShortUnit[unit]}`;
}
