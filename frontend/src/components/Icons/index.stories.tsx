import { Story } from "@storybook/react";
import { SVGProps } from "react";
import * as Icons from ".";
import { Flex } from "../Layout";

export default {
  title: "Components/Icons",
  component: Icons,
};

export const Template: Story<SVGProps<SVGSVGElement>> = (args) => (
  <Flex css={{ gap: "$3" }}>
    {Object.entries(Icons).map(([name, Component]) => (
      <Component key={name} {...args} />
    ))}
  </Flex>
);
