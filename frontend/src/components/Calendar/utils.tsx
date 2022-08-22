import { COLS, ROWS } from "./constants";

export const getNumberOfDays = (year: number, month: number) => {
  return 32 - new Date(year, month, 32).getDate();
};

export const getMonthDetails = (year: number, month: number) => {
  const firstDay = new Date(year, month).getDay();
  const numberOfDays = getNumberOfDays(year, month);
  const monthArray = [];
  let index = 0;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const currentDay = getDayDetails({
        index,
        numberOfDays,
        firstDay,
        year,
        month,
      });
      monthArray.push(currentDay);
      index++;
    }
  }
  return monthArray;
};

export interface DayDetails {
  date: number;
  day: number;
  month: number;
  year: number;
  timestamp: number;
}

export const getDayDetails = (args: {
  index: number;
  numberOfDays: number;
  firstDay: number;
  year: number;
  month: number;
}): DayDetails => {
  const dateDelta = args.index - args.firstDay;
  const day = args.index % 7;

  let prevMonth = args.month - 1;
  let prevYear = args.year;
  if (prevMonth < 0) {
    prevMonth = 11;
    prevYear--;
  }
  const prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth);

  const date =
    (dateDelta < 0 ? prevMonthNumberOfDays + dateDelta : dateDelta % args.numberOfDays) +
    1;
  const monthDelta = dateDelta < 0 ? -1 : dateDelta >= args.numberOfDays ? 1 : 0;
  const relativeMonth = args.month + monthDelta;
  const month = relativeMonth < 0 ? 11 : relativeMonth > 11 ? 0 : relativeMonth;
  const year =
    relativeMonth < 0 ? args.year - 1 : relativeMonth > 11 ? args.year + 1 : args.year;
  const timestamp = new Date(year, month, date).getTime();

  return {
    date,
    day,
    month,
    year,
    timestamp,
  };
};

export const isSameDay = (dayDetails: DayDetails, date: Date) => {
  return (
    date.getDate() === dayDetails.date &&
    date.getMonth() === dayDetails.month &&
    date.getFullYear() === dayDetails.year
  );
};
