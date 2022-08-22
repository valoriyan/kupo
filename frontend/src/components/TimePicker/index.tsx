import React, { useEffect, useRef, useState } from "react";
import { styled } from "#/styling";
import { DropdownMenu } from "../DropdownMenu";
import { Flex } from "../Layout";
import { bodyStyles } from "../Typography";

export const TIME_PERIODS = ["AM" as const, "PM" as const];

export const getAmPm = (dateTime: Date) => {
  const hour = dateTime.getHours();
  const amPm = hour < 12 ? TIME_PERIODS[0] : TIME_PERIODS[1];
  const newHour = hour === 12 || hour === 0 ? 12 : hour % 12;
  return [amPm, newHour] as const;
};

export interface TimePickerProps {
  time: Date | undefined;
  setTime: (newTime: Date) => void;
}

export const TimePicker = (props: TimePickerProps) => {
  const firstRender = useRef(true);
  const [hour, setHour] = useState(() => {
    const rawHour = props.time?.getHours();
    return rawHour === undefined ? 12 : rawHour % 12 === 0 ? 12 : rawHour % 12;
  });
  const [minute, setMinute] = useState(props.time?.getMinutes() ?? 0);
  const [timePeriod, setTimePeriod] = useState(
    props.time ? getAmPm(props.time)[0] : TIME_PERIODS[0],
  );

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const rawHour = props.time?.getHours();
    const oldHour =
      rawHour === undefined ? undefined : rawHour % 12 === 0 ? 12 : rawHour % 12;
    const oldMinute = props.time?.getMinutes();
    const oldTimePeriod = !props.time
      ? undefined
      : props.time.getHours() < 12
      ? TIME_PERIODS[0]
      : TIME_PERIODS[1];

    if (oldHour === hour && oldMinute === minute && oldTimePeriod === timePeriod) return;

    const newDate = new Date(props.time ?? Date.now());
    const newHour = timePeriod === TIME_PERIODS[0] ? hour % 12 : (hour % 12) + 12;

    newDate.setHours(newHour);
    newDate.setMinutes(minute);
    newDate.setSeconds(0);
    props.setTime(newDate);
  }, [hour, minute, props, timePeriod]);

  return (
    <Flex css={{ gap: "$2", alignItems: "center" }}>
      <Input
        type="number"
        min={1}
        max={12}
        value={hour.toString().padStart(2, "0")}
        onChange={(e) => {
          const newHour = parseInt(e.currentTarget.value, 10);
          if (Number.isNaN(newHour) || newHour < 1 || newHour > 12) return;
          setHour(newHour);
        }}
      />
      :
      <Input
        type="number"
        min={0}
        max={60}
        value={minute.toString().padStart(2, "0")}
        onChange={(e) => {
          const newMinute = parseInt(e.currentTarget.value, 10);
          if (Number.isNaN(newMinute) || newMinute < 0 || newMinute > 60) return;
          setMinute(newMinute);
        }}
      />
      <DropdownMenu
        trigger={timePeriod}
        items={TIME_PERIODS.map((value) => ({ label: value, value }))}
        selectedItem={timePeriod}
        onSelect={setTimePeriod}
      />
    </Flex>
  );
};

const Input = styled("input", bodyStyles, {
  background: "transparent",
  px: "$1",
  width: "calc(2ch + $1 + $1 + $1)",
  border: "solid $borderWidths$1 $border",
  textAlign: "center",

  // hide spin button for number input
  "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
    "-webkit-appearance": "none",
    margin: 0,
  },
  "input[type=number]": {
    "-moz-appearance": "textfield",
  },
});
