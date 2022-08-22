import { Story } from "@storybook/react";
import { useState } from "react";
import { HashTags, HashTagsProps } from ".";

export default {
  title: "Components/HashTags",
  component: HashTags,
};

export const Template: Story<HashTagsProps> = (args) => {
  const [hashTags, setHashTags] = useState<string[]>([]);
  return <HashTags {...args} hashTags={hashTags} setHashTags={setHashTags} />;
};
Template.args = {
  limit: 5,
  placeholder: "add hashtags (limit 5)",
};
