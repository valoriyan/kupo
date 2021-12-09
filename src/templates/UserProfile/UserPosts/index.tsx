import { RenderablePost } from "#/api";
import { useLikePost } from "#/api/mutations/posts/likePost";
import { useUnlikePost } from "#/api/mutations/posts/unlikePost";
import { useGetPageOfPostsByUserId } from "#/api/queries/posts/useGetPostsByUserId";
import { ErrorMessage } from "#/components/ErrorArea";
import { Stack } from "#/components/Layout";
import { Post } from "#/components/Post";
import { Spinner } from "#/components/Spinner";
import { styled } from "#/styling";

export interface UserPostsProps {
  userId: string;
  username: string;
  userAvatar?: string;
}

const PostWrapper = ({ post }: { post: RenderablePost }) => {
  const { isLikedByClient, postId, authorUserId } = post;

  const { mutateAsync: likePost } = useLikePost({
    postId,
  });
  const { mutateAsync: unlikePost } = useUnlikePost({
    postId,
    authorUserId,
  });

  async function handleClickOfLikeButton() {
    if (isLikedByClient) {
      unlikePost();
    } else {
      likePost();
    }
  }

  return (
    <Post
      key={post.postId}
      post={post}
      authorUserName={post.authorUserId}
      authorUserAvatar={undefined}
      handleClickOfLikeButton={handleClickOfLikeButton}
    />
  );
};

export const UserPosts = (props: UserPostsProps) => {
  const { data, isLoading, error } = useGetPageOfPostsByUserId({ userId: props.userId });

  if (error && !isLoading) {
    return <ErrorMessage>{error.message}</ErrorMessage>;
  }

  if (isLoading || !data) {
    return (
      <Stack css={{ pt: "$9" }}>
        <Spinner size="lg" />
      </Stack>
    );
  }

  const posts = data.pages.flatMap((page) => {
    return page.posts;
  });

  return (
    <Wrapper>
      {posts.map((post) => (
        <PostWrapper key={post.postId} post={post} />
      ))}
    </Wrapper>
  );
};

const Wrapper = styled(Stack, {
  height: "100%",
  overflow: "auto",
  gap: "$2",
  py: "$2",
  "> *:not(:last-child)": {
    borderBottom: "solid $borderWidths$1 $border",
  },
});
