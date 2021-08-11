import { Story } from "@storybook/react";
import { Spinner, SpinnerProps } from ".";
import { Flex } from "../Layout";

export default {
  title: "Spinner",
  component: Spinner,
};

export const Template: Story<SpinnerProps> = (args) => <Spinner {...args} />;
Template.args = {
  size: "medium",
  text: "Loading...",
};

export const AllSizes = () => {
  return (
    <Flex css={{ gap: "$4", justifyContent: "space-around", alignItems: "center" }}>
      <Spinner size="xsmall" text="xsmall" />
      <Spinner size="small" text="small" />
      <Spinner size="medium" text="medium" />
      <Spinner size="large" text="large" />
    </Flex>
  );
};

export const WithAndWithoutText = () => {
  return (
    <Flex css={{ gap: "$4", justifyContent: "space-around", alignItems: "center" }}>
      <Spinner size="medium" text="Loading..." />
      <Spinner size="medium" />
    </Flex>
  );
};
