import { Story } from "@storybook/react";
import { LoadingArea } from ".";
import { Flex } from "../Layout";
import { SpinnerProps } from "../Spinner";

export default {
  title: "Components/LoadingArea",
  component: LoadingArea,
};

export const Template: Story<SpinnerProps> = (args) => (
  <Flex css={{ height: "100vh", justifyContent: "center", alignItems: "center" }}>
    <LoadingArea {...args} />
  </Flex>
);
Template.args = { size: "md", text: "Loading Content..." };
