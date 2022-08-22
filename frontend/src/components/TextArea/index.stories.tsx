import { Story } from "@storybook/react";
import { TextArea } from ".";

export default {
  title: "Components/TextArea",
  component: TextArea,
};

export const Template: Story = (args) => <TextArea {...args} />;
