import { Story } from "@storybook/react";
import { Input } from ".";

export default {
  title: "Components/Input",
  component: Input,
};

export const Template: Story<{ size: "md" | "lg" }> = (args) => <Input {...args} />;
Template.args = {
  size: "md",
};
Template.argTypes = {
  size: {
    options: ["md", "lg"],
    control: { type: "select" },
  },
};
