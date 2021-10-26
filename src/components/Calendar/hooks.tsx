import { useState } from "react";
import { DayDetails } from "./utils";

export interface useCalendarStateArgs {
  initialSelectedDate?: Date | null;
  onDateSelection?: (selectedDate: Date) => void;
  shouldNotSelectDate?: boolean;
}

export const useCalendarState = (args?: useCalendarStateArgs) => {
  const [state, setState] = useState(() => {
    const today = new Date();
    const initialDate =
      args?.initialSelectedDate === null ? undefined : args?.initialSelectedDate ?? today;

    const year = (initialDate ?? today).getFullYear();
    const month = (initialDate ?? today).getMonth();

    return {
      selectedDate: initialDate,
      year,
      month,
      prevView: new Date(year, month),
      curView: new Date(year, month),
    };
  });

  const setMonth = (month: number) => {
    setState((prev) => ({
      ...prev,
      month,
      prevView: prev.curView,
      curView: new Date(prev.year, month),
    }));
  };

  const setYear = (year: number) => {
    setState((prev) => ({
      ...prev,
      year,
      prevView: prev.curView,
      curView: new Date(year, prev.month),
    }));
  };

  const selectDate = (dayDetails: DayDetails) => {
    const newDate = new Date(dayDetails.timestamp);
    if (!args?.shouldNotSelectDate) {
      setState((prev) => ({
        ...prev,
        selectedDate: newDate,
        year: dayDetails.year,
        month: dayDetails.month,
        prevView: prev.curView,
        curView: new Date(dayDetails.year, dayDetails.month),
      }));
    }
    args?.onDateSelection?.(newDate);
  };

  return {
    ...state,
    setMonth,
    setYear,
    selectDate,
  };
};

export type CalendarState = ReturnType<typeof useCalendarState>;
