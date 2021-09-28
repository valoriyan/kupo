import { Story } from "@storybook/react";
import { PropsWithChildren } from "react";
import { ErrorArea } from ".";
import { Flex } from "../Layout";

export default {
  title: "Components/ErrorArea",
  component: ErrorArea,
};

export const Template: Story<PropsWithChildren<unknown>> = (args) => (
  <Flex css={{ height: "100vh", justifyContent: "center", alignItems: "center" }}>
    <ErrorArea {...args} />
  </Flex>
);
Template.args = { children: "An unknown error has occurred" };
