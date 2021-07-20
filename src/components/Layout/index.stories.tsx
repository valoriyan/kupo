import { Story } from "@storybook/react";
import { ComponentProps } from "react";
import { Box } from ".";

export default {
  title: "Components/Box",
  component: Box,
};

export const Template: Story<ComponentProps<typeof Box>> = (args) => (
  <Box {...(args as any)} />
);
