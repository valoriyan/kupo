import { DateTime, DurationUnit } from "luxon";

// Converts a JS timestamp to a string like "3 hours ago" or "12 years ago"
export function getRelativeTimestamp(timestamp: number): string {
  const units: DurationUnit[] = [
    'year',
    'month',
    'week',
    'day',
    'hour',
    'minute',
    'second',
  ];
  
  let dateTime = DateTime.fromMillis(timestamp)
  const diff = dateTime.diffNow().shiftTo(...units);
  const unit = units.find((unit) => diff.get(unit) !== 0) || 'second';

  const relativeFormatter = new Intl.RelativeTimeFormat('en', {
    numeric: 'auto',
  });
  return relativeFormatter.format(Math.trunc(diff.as(unit)), unit as Intl.RelativeTimeFormatUnit);
  
}