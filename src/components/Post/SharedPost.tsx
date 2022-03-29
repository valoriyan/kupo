import { RenderablePost } from "#/api";
import { useGetUserByUserId } from "#/api/queries/users/useGetUserByUserId";
import { styled } from "#/styling";
import { goToPostPage } from "#/templates/SinglePost";
import { getRelativeTimestamp } from "#/utils/getRelativeTimestamp";
import { PostBody } from "./PostBody";

export interface SharedPostProps {
  post: RenderablePost;
  setCurrentMediaUrl?: (url: string | undefined) => void;
  contentHeight?: string;
}

export const SharedPost = ({
  post,
  setCurrentMediaUrl,
  contentHeight,
}: SharedPostProps) => {
  const { authorUserId, caption, contentElements, shared } = post;
  const { data: user } = useGetUserByUserId({ userId: authorUserId });
  const relativeTimestamp = getRelativeTimestamp(post.creationTimestamp);

  return (
    <Wrapper>
      <PostBody
        authorUserName={user?.username}
        authorUserAvatar={user?.profilePictureTemporaryUrl}
        relativeTimestamp={relativeTimestamp}
        caption={caption}
        contentElements={contentElements}
        setCurrentMediaUrl={setCurrentMediaUrl}
        shared={shared}
        onPostClick={() => goToPostPage(post.postId)}
        contentHeight={contentHeight}
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
