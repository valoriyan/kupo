import { Story } from "@storybook/react";
import { Button, ButtonProps } from ".";

export default {
  title: "Components/Button",
  component: Button,
};

export const Template: Story<ButtonProps> = (args) => <Button {...args} />;
Template.args = {
  children: "Click Me",
};
