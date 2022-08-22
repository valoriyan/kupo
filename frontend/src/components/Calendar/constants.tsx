export const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const SHORT_DAYS = DAYS.map((day) => day.slice(0, 3));

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const SHORT_MONTHS = MONTHS.map((month) => month.slice(0, 3));

export const ROWS = 6;
export const COLS = 7;

export const CALENDAR_HEIGHT = "390px";
export const COMPACT_CALENDAR_HEIGHT = "312px";
