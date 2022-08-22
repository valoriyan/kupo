import { Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import React from "react";
import { TimePicker, TimePickerProps } from ".";
import { Box } from "../Layout";

export default {
  title: "Components/TimePicker",
  component: TimePicker,
};

export const Template: Story<TimePickerProps> = (args) => (
  <Box css={{ p: "$3" }}>
    <TimePicker {...args} />
  </Box>
);
Template.args = {
  time: undefined,
  setTime: (newTime) => action(newTime.toISOString()),
};
