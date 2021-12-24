import { Story } from "@storybook/react";
import { Avatar, AvatarProps } from ".";

export default {
  title: "Components/Avatar",
  component: Avatar,
};

export const Template: Story<AvatarProps> = (args) => <Avatar {...args} />;
Template.args = { size: "$7" };
