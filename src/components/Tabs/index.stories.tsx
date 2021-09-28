import { Story } from "@storybook/react";
import { Tabs, TabsProps } from ".";
import { Stack } from "../Layout";

export default {
  title: "Components/Tabs",
  component: Tabs,
};

export const Template: Story<TabsProps> = (args) => <Tabs {...args} />;
Template.args = {
  ariaLabel: "Storybook Tabs",
  tabs: [
    {
      id: "posts",
      trigger: "Posts",
      content: <Stack css={{ p: "$4" }}>User Posts Go Here</Stack>,
    },
    {
      id: "shop",
      trigger: "Shop",
      content: <Stack css={{ p: "$4" }}>User Shop Items Go Here</Stack>,
    },
  ],
};
