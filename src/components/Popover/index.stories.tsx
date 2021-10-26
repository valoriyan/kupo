import { Story } from "@storybook/react";
import { Popover, PopoverProps } from ".";
import { Button } from "../Button";
import { Box, Stack } from "../Layout";
import { Body, MainTitle } from "../Typography";

export default {
  title: "Components/Popover",
  component: Popover,
};

export const Template: Story<PopoverProps> = (args) => (
  <Box css={{ p: "$4" }}>
    <Popover {...args} />
  </Box>
);
Template.args = {
  trigger: <Button as="div">Open Popover</Button>,
  children: (
    <Stack css={{ gap: "$4", p: "$3" }}>
      <MainTitle>Popover Example</MainTitle>
      <Body>This is a popover</Body>
    </Stack>
  ),
};
