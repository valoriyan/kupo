import { RenderablePost, RenderableUser } from "#/api";
import { useDeletePost } from "#/api/mutations/posts/deletePost";
import { useLikePost } from "#/api/mutations/posts/likePost";
import { useUnlikePost } from "#/api/mutations/posts/unlikePost";
import { useGetPageOfPostsByUserId } from "#/api/queries/posts/useGetPageOfPostsByUserId";
import { ErrorMessage } from "#/components/ErrorArea";
import { InfoIcon, TrashIcon } from "#/components/Icons";
import { Stack } from "#/components/Layout";
import { Post } from "#/components/Post";
import { Spinner } from "#/components/Spinner";
import { useCurrentUserId } from "#/contexts/auth";
import { styled } from "#/styling";

export interface UserPostsProps {
  user: RenderableUser;
}

export const UserPosts = ({ user }: UserPostsProps) => {
  const { data, isLoading, error } = useGetPageOfPostsByUserId({ userId: user.userId });

  if (error && !isLoading) {
    return <ErrorMessage>{error.message}</ErrorMessage>;
  }

  if (isLoading || !data) {
    return (
      <Stack css={{ pt: "$10" }}>
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
        <PostWrapper key={post.postId} post={post} user={user} />
      ))}
    </Wrapper>
  );
};

const PostWrapper = ({ post, user }: { post: RenderablePost; user: RenderableUser }) => {
  const { isLikedByClient, postId, authorUserId } = post;
  const userId = useCurrentUserId();

  const { mutateAsync: likePost } = useLikePost({ postId, authorUserId });
  const { mutateAsync: unlikePost } = useUnlikePost({ postId, authorUserId });
  const { mutateAsync: deletePost } = useDeletePost({ postId, authorUserId });

  const handleClickOfLikeButton = () => {
    if (isLikedByClient) unlikePost();
    else likePost();
  };

  async function handleClickOfShareButton() {
    console.log("SHARING POST!");
  }

  const menuActions = [];

  if (userId === authorUserId) {
    menuActions.push({
      Icon: TrashIcon,
      label: "Delete Post",
      onClick: () => {
        deletePost();
      },
    });
  }

  menuActions.push({
    Icon: InfoIcon,
    label: "More To Come...",
    onClick: () => {},
  });

  return (
    <Post
      key={post.postId}
      post={post}
      authorUserName={user.username}
      authorUserAvatar={user.profilePictureTemporaryUrl}
      handleClickOfLikeButton={handleClickOfLikeButton}
      handleClickOfShareButton={handleClickOfShareButton}
      menuActions={menuActions}
    />
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
