import { Story } from "@storybook/react";
import { Post, PostProps } from ".";

export default {
  title: "Components/Post",
  component: Post,
};

export const Template: Story<PostProps> = (args) => <Post {...args} />;
Template.args = {
  post: {
    postId: "1",
    postAuthorUserId: "blake",
    caption:
      "This is a test post with enough text that it will truncate. This is a test post with enough text that it will truncate. This is a test post with enough text that it will truncate.",
    scheduledPublicationTimestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
    contentElementTemporaryUrls: [
      "https://via.placeholder.com/450x300.png?text=Placeholder+1",
      "https://via.placeholder.com/450x300.png?text=Placeholder+2",
    ],
    hashtags: ["test", "placeholder", "newPost"],
  },
};
