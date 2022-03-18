import { RenderablePost } from "#/api";
import { useGetUserByUserId } from "#/api/queries/users/useGetUserByUserId";
import { styled } from "#/styling";
import { getRelativeTimestamp } from "#/utils/getRelativeTimestamp";
import { PostBody } from "./PostBody";

export interface SharedPostProps {
  post: RenderablePost;
}

export const SharedPost = ({ post }: SharedPostProps) => {
  const { authorUserId, caption, contentElementTemporaryUrls, shared } = post;
  const relativeTimestamp = getRelativeTimestamp(post.creationTimestamp);

  const { data: user } = useGetUserByUserId({ userId: authorUserId });
  const authorUserName = user?.username;
  const authorUserAvatar = user?.profilePictureTemporaryUrl;

  return (
    <Wrapper>
      <PostBody
        authorUserName={authorUserName}
        authorUserAvatar={authorUserAvatar}
        relativeTimestamp={relativeTimestamp}
        caption={caption}
        contentUrls={contentElementTemporaryUrls}
        shared={shared}
      />
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  m: "$3",
  mb: "0",
  overflow: "hidden",
  borderRadius: "$3",
  border: "solid $borderWidths$1 $border",
});
