import { Story } from "@storybook/react";
import { useState } from "react";
import { RadioGroup, RadioGroupProps } from ".";

export default {
  title: "Components/RadioGroup",
  component: RadioGroup,
};

export const Template: Story<RadioGroupProps> = (args) => {
  const [value, setValue] = useState<string>();

  return <RadioGroup {...args} value={value} onChange={setValue} />;
};
Template.args = {
  ariaLabel: "Fruits",
  options: ["apple", "orange", "pear", "strawberry", "cherry"].map((x) => ({
    value: x,
    label: x.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase(),
    ),
  })),
};
