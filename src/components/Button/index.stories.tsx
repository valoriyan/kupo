import { Story } from "@storybook/react";
import { Button } from ".";

export default {
  title: "Components/Button",
  component: Button,
};

export const Template: Story = (args) => <Button {...args} />;
Template.args = {
  children: "Click Me",
  variant: "primary",
  size: "md",
};
