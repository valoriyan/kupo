import { Story } from "@storybook/react";
import { Avatar, AvatarProps } from ".";
import { StackedAvatars } from "./StackedAvatars";

export default {
  title: "Components/Avatar",
  component: Avatar,
};

export const Template: Story<AvatarProps> = (args) => <Avatar {...args} />;
Template.args = { size: "$7" };

export const StackedAvatarsWithFewAvatars = () => (
  <StackedAvatars
    size="$7"
    images={[
      { alt: "1", src: "https://via.placeholder.com/200.png?text=1" },
      { alt: "2", src: "https://via.placeholder.com/200.png?text=2" },
      { alt: "3", src: "https://via.placeholder.com/200.png?text=3" },
    ]}
  />
);

export const StackedAvatarsWithManyAvatars = () => (
  <StackedAvatars
    size="$7"
    images={[
      { alt: "1", src: "https://via.placeholder.com/200.png?text=1" },
      { alt: "2", src: "https://via.placeholder.com/200.png?text=2" },
      { alt: "3", src: "https://via.placeholder.com/200.png?text=3" },
      { alt: "4", src: "https://via.placeholder.com/200.png?text=4" },
      { alt: "5", src: "https://via.placeholder.com/200.png?text=5" },
    ]}
  />
);
