import { Button } from "../Button";
import {
  Calendar,
  COMPACT_CALENDAR_HEIGHT,
  SHORT_MONTHS,
  useCalendarState,
} from "../Calendar";
import { ChevronDownIcon } from "../Icons";
import { Box, Flex, Stack } from "../Layout";
import { Popover } from "../Popover";
import { getAmPm, TimePicker } from "../TimePicker";
import { Body } from "../Typography";

export interface DateTimePickerProps {
  dateTime: Date | undefined;
  setDateTime: (newDateTime: Date | undefined) => void;
  placeholder: string;
}

export const DateTimePicker = (props: DateTimePickerProps) => {
  return (
    <Popover
      align="end"
      trigger={
        <Flex css={{ alignItems: "center", gap: "$2" }}>
          <Body css={{ color: props.dateTime ? "$primary" : "$text" }}>
            {props.dateTime ? formatDateTime(props.dateTime) : props.placeholder}
          </Body>
          <ChevronDownIcon />
        </Flex>
      }
    >
      {({ hide }) => (
        <DateTimePickerBody
          dateTime={props.dateTime}
          setDateTime={props.setDateTime}
          hide={hide}
        />
      )}
    </Popover>
  );
};

const DateTimePickerBody = (
  props: Pick<DateTimePickerProps, "dateTime" | "setDateTime"> & { hide: () => void },
) => {
  const calendarState = useCalendarState({
    initialSelectedDate: props.dateTime ?? null,
    onDateSelection: (selectedDate) => {
      const newDate = new Date((props.dateTime ?? selectedDate).valueOf());
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      props.setDateTime(newDate);
    },
  });

  return (
    <Stack css={{ width: "320px", maxWidth: "100vw", gap: "$5", pb: "$5" }}>
      <Box css={{ height: COMPACT_CALENDAR_HEIGHT }}>
        <Calendar calendarState={calendarState} compact />
      </Box>
      <Flex css={{ alignItems: "center", justifyContent: "space-between", px: "$5" }}>
        <Flex css={{ alignItems: "center", gap: "$3" }}>
          @ <TimePicker time={props.dateTime} setTime={props.setDateTime} />
        </Flex>
        <Button
          outlined
          size="sm"
          onClick={() => {
            props.setDateTime(undefined);
            props.hide();
          }}
        >
          Clear
        </Button>
      </Flex>
    </Stack>
  );
};

const formatDateTime = (dateTime: Date) => {
  const [amPm, hour] = getAmPm(dateTime);
  return `${
    SHORT_MONTHS[dateTime.getMonth()]
  } ${dateTime.getDate()}, ${dateTime.getFullYear()} @ ${hour
    .toString()
    .padStart(2, "0")}:${dateTime.getMinutes().toString().padStart(2, "0")} ${amPm}`;
};
