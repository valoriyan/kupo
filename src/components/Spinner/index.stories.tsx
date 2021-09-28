import { Story } from "@storybook/react";
import { Spinner, SpinnerProps } from ".";
import { Flex } from "../Layout";

export default {
  title: "Components/Spinner",
  component: Spinner,
};

export const Template: Story<SpinnerProps> = (args) => <Spinner {...args} />;
Template.args = {
  size: "md",
  text: "Loading...",
};

export const AllSizes = () => {
  return (
    <Flex css={{ gap: "$4", justifyContent: "space-around", alignItems: "center" }}>
      <Spinner size="xs" text="xs" />
      <Spinner size="sm" text="sm" />
      <Spinner size="md" text="md" />
      <Spinner size="lg" text="lg" />
    </Flex>
  );
};

export const WithAndWithoutText = () => {
  return (
    <Flex css={{ gap: "$4", justifyContent: "space-around", alignItems: "center" }}>
      <Spinner size="md" text="Loading..." />
      <Spinner size="md" />
    </Flex>
  );
};
