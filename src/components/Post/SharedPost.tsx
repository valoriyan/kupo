import { RenderablePost } from "#/api";
import { useGetUserByUserId } from "#/api/queries/users/useGetUserByUserId";
import { styled } from "#/styling";
import { goToPostPage } from "#/templates/SinglePost";
import { getRelativeTimestamp } from "#/utils/getRelativeTimestamp";
import { PostBody } from "./PostBody";

export interface SharedPostProps {
  post: RenderablePost;
}

export const SharedPost = ({ post }: SharedPostProps) => {
  const { authorUserId, caption, contentElementTemporaryUrls, shared } = post;
  const { data: user } = useGetUserByUserId({ userId: authorUserId });
  const relativeTimestamp = getRelativeTimestamp(post.creationTimestamp);

  return (
    <Wrapper>
      <PostBody
        authorUserName={user?.username}
        authorUserAvatar={user?.profilePictureTemporaryUrl}
        relativeTimestamp={relativeTimestamp}
        caption={caption}
        contentUrls={contentElementTemporaryUrls}
        shared={shared}
        onPostClick={() => goToPostPage(post.postId)}
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
