import { action } from "@storybook/addon-actions";
import { Story } from "@storybook/react";
import { Box } from "../Layout";
import { Calendar, CalendarProps, CALENDAR_HEIGHT, useCalendarState } from ".";

const fourDays = 1000 * 60 * 60 * 24 * 4;

export default {
  title: "Components/Calendar",
  component: Calendar,
};

export const Template: Story<Omit<CalendarProps, "calendarState">> = (args) => {
  const calendarState = useCalendarState({
    onDateSelection: action("Date Selected"),
  });

  return (
    <Box css={{ height: CALENDAR_HEIGHT }}>
      <Calendar
        calendarState={calendarState}
        datesWithAdditions={args.datesWithAdditions}
        datesWithRemovals={args.datesWithRemovals}
      />
    </Box>
  );
};
Template.args = {
  datesWithAdditions: [new Date()],
  datesWithRemovals: [new Date(Date.now() + fourDays)],
};
