import { Story } from "@storybook/react";
import { BackgroundImage, BackgroundImageProps } from ".";

export default {
  title: "Components/BackgroundImage",
  component: BackgroundImage,
};

export const Template: Story<BackgroundImageProps> = (args) => (
  <BackgroundImage {...args} />
);
