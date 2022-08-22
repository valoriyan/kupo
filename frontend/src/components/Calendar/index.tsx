import React, { useMemo } from "react";
import { Stack } from "../Layout";
import { TransitionArea } from "../TransitionArea";
import { CalendarBody } from "./CalendarBody";
import { CalendarHeader } from "./CalendarHeader";
import { useCalendarState } from "./hooks";
import { getMonthDetails } from "./utils";

export * from "./constants";
export { useCalendarState } from "./hooks";
export type { CalendarState } from "./hooks";

export interface CalendarProps {
  calendarState: ReturnType<typeof useCalendarState>;
  datesWithAdditions?: Date[];
  datesWithRemovals?: Date[];
  compact?: boolean;
}

export const Calendar = ({
  calendarState,
  datesWithAdditions,
  datesWithRemovals,
  compact,
}: CalendarProps) => {
  const { year: viewingYear, month: viewingMonth } = calendarState;

  const monthDetails = useMemo(
    () => getMonthDetails(viewingYear, viewingMonth),
    [viewingYear, viewingMonth],
  );

  const isLater = calendarState.prevView.valueOf() < calendarState.curView.valueOf();

  return (
    <Stack css={{ gap: "$2", height: "100%" }}>
      <CalendarHeader
        year={calendarState.year}
        month={calendarState.month}
        setMonth={calendarState.setMonth}
        setYear={calendarState.setYear}
      />
      <TransitionArea
        transitionKey={`${calendarState.year}-${calendarState.month}`}
        custom={isLater}
        animation={{
          initial: (isLater: boolean) => ({ translateX: isLater ? "100%" : "-100%" }),
          animate: { translateX: 0 },
          exit: (isLater: boolean) => ({ translateX: isLater ? "-100%" : "100%" }),
        }}
      >
        <CalendarBody
          selectedDate={calendarState.selectedDate}
          selectDate={calendarState.selectDate}
          currentMonth={viewingMonth}
          monthDetails={monthDetails}
          datesWithAdditions={datesWithAdditions}
          datesWithRemovals={datesWithRemovals}
          compact={compact}
        />
      </TransitionArea>
    </Stack>
  );
};
