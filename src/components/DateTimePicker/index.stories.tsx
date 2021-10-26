import { Story } from "@storybook/react";
import { useState } from "react";
import { action } from "@storybook/addon-actions";
import { Box } from "../Layout";
import { DateTimePicker, DateTimePickerProps } from ".";

export default {
  title: "Components/DateTimePicker",
  component: DateTimePicker,
};

export const Template: Story<DateTimePickerProps> = (args) => {
  const [dateTime, setDateTime] = useState<Date>();

  return (
    <Box css={{ p: "$4" }}>
      <DateTimePicker
        dateTime={dateTime}
        setDateTime={(newDateTime) => {
          action("Select Date Time")(newDateTime);
          setDateTime(newDateTime);
        }}
        placeholder={args.placeholder}
      />
    </Box>
  );
};
Template.args = {
  placeholder: "No Date Selected",
};
