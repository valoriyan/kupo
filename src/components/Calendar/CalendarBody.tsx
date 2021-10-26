import React from "react";
import { styled } from "#/styling";
import { Grid } from "../Layout";
import { Body, bodyStyles } from "../Typography";
import { COLS, ROWS, SHORT_DAYS } from "./constants";
import { DayDetails, isSameDay } from "./utils";
import { range } from "#/utils/range";

export interface CalendarBodyProps {
  selectedDate?: Date;
  selectDate: (dayDetails: DayDetails) => void;
  currentMonth: number;
  monthDetails: DayDetails[];
  datesWithAdditions?: Date[];
  datesWithRemovals?: Date[];
  compact?: boolean;
}

export const CalendarBody = (props: CalendarBodyProps) => {
  return (
    <Wrapper css={{ rowGap: props.compact ? "$2" : "$3" }}>
      <Row>
        {SHORT_DAYS.map((day) => {
          return <WeekDay key={day}>{day}</WeekDay>;
        })}
      </Row>
      {range(ROWS).map((row) => (
        <Row key={row}>
          {range(COLS).map((col) => {
            const date = props.monthDetails[row * COLS + col];
            const hasAdditions = !!props.datesWithAdditions?.some((dateWithAdditions) =>
              isSameDay(date, dateWithAdditions),
            );
            const hasRemovals = !!props.datesWithRemovals?.some((dateWithRemovals) =>
              isSameDay(date, dateWithRemovals),
            );
            return (
              <Day
                key={col}
                currentMonth={date.month === props.currentMonth}
                isSelectedDate={props.selectedDate && isSameDay(date, props.selectedDate)}
                isToday={isSameDay(date, new Date())}
                onClick={() => props.selectDate(date)}
                css={{ size: props.compact ? "$6" : "$7" }}
              >
                {(hasAdditions || hasRemovals) && (
                  <NotificationWrapper double={hasAdditions && hasRemovals}>
                    {hasAdditions && <EventNotification hasAdditions />}
                    {hasRemovals && <EventNotification hasRemovals />}
                  </NotificationWrapper>
                )}
                {date.date}
              </Day>
            );
          })}
        </Row>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled(Grid, {
  gridTemplateRows: "repeat(7, 1fr)",
  px: "$4",
});

const Row = styled(Grid, {
  gridTemplateColumns: "repeat(7, $sizes$6)",
  justifyContent: "space-between",
});

const WeekDay = styled(Body, {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  pb: "$2",
  color: "$primary",
  fontWeight: "$bold",
});

const Day = styled("button", bodyStyles, {
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "$secondaryText",
  borderRadius: "$round",

  variants: {
    currentMonth: { true: { color: "$text" } },
    isSelectedDate: { true: { bg: "$primary", color: "$accentText" } },
    isToday: { true: { border: "solid $borderWidths$1 $primary" } },
  },
  defaultVariants: { currentMonth: true },
});

const NotificationWrapper = styled("div", {
  display: "flex",
  gap: "$2",
  position: "absolute",
  top: "$1",
  right: 0,

  variants: {
    double: { true: { right: "-$3" } },
  },
});

const EventNotification = styled("div", {
  size: "$3",
  borderRadius: "$round",

  variants: {
    hasAdditions: { true: { bg: "$success" } },
    hasRemovals: { true: { bg: "$failure" } },
  },
});
