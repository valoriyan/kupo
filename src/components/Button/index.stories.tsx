import { Story } from "@storybook/react";
import { ReactNode } from "react";
import { Button } from ".";

export default {
  title: "Components/Button",
  component: Button,
};

export const Template: Story<{ children: ReactNode }> = (args) => <Button {...args} />;
Template.args = {
  children: "Click Me",
};
