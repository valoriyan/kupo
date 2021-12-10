import { RenderablePost } from "#/api";
import { useLikePost } from "#/api/mutations/posts/likePost";
import { useUnlikePost } from "#/api/mutations/posts/unlikePost";
import { useGetPageOfPostsByUserId } from "#/api/queries/posts/useGetPostsByUserId";
import { useGetUserByUserId } from "#/api/queries/users/useGetUserByUserId";
import { ErrorMessage } from "#/components/ErrorArea";
import { Heart } from "#/components/Icons";
import { Stack } from "#/components/Layout";
import { Post } from "#/components/Post";
import { Spinner } from "#/components/Spinner";
import { useCurrentUserId } from "#/contexts/auth";
import { styled } from "#/styling";
import { getRelativeTimestamp } from "#/utils/getRelativeTimestamp";

export interface UserPostsProps {
  userId: string;
  username: string;
  userAvatar?: string;
}

const PostWrapper = ({ post }: { post: RenderablePost }) => {
  const { isLikedByClient, postId, authorUserId } = post;
  const {
    data: user,
    isLoading,
    error,
    isError,
  } = useGetUserByUserId({ userId: authorUserId });

  const { mutateAsync: likePost } = useLikePost({
    postId,
    authorUserId,
  });
  const { mutateAsync: unlikePost } = useUnlikePost({
    postId,
    authorUserId,
  });

  if (isError && !isLoading) {
    return <div>Error: {(error as Error).message}</div>;
  }

  if (isLoading || !user) {
    return <div>Loading</div>;
  }

  async function handleClickOfLikeButton() {
    if (isLikedByClient) {
      unlikePost();
    } else {
      likePost();
    }
  }

  const firstMenuOption = {
    Icon: Heart,
    label: "Delete Post",
    onClick: () => {
      console.log("Yay Blake is great!");
    },
  };

  const secondMenuOption = {
    Icon: Heart,
    label: "Oh nooooess!",
    onClick: () => {
      console.log(
        "Yay Blake screwed up! (but it was something that needed to be screwed up.",
      );
    },
  };

  return (
    <Post
      key={post.postId}
      postRelativeTimestamp={getRelativeTimestamp(post.creationTimestamp)}
      post={post}
      authorUserName={user.username}
      authorUserAvatar={user.profilePictureTemporaryUrl}
      handleClickOfLikeButton={handleClickOfLikeButton}
      menuOptions={[firstMenuOption, secondMenuOption]}
    />
  );
};

export const UserPosts = (props: UserPostsProps) => {
  const { data, isLoading, error } = useGetPageOfPostsByUserId({ userId: props.userId });

  const userId = useCurrentUserId();
  console.log("userId", userId);

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
