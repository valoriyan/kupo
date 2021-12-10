import { RenderablePost } from "#/api";
import { useLikePost } from "#/api/mutations/posts/likePost";
import { useUnlikePost } from "#/api/mutations/posts/unlikePost";
import { useGetUserByUserId } from "#/api/queries/users/useGetUserByUserId";
import { Heart } from "#/components/Icons";
import { Post } from "#/components/Post";
import { getRelativeTimestamp } from "#/utils/getRelativeTimestamp";

export const ContentFeedPostBox = ({ post }: { post: RenderablePost }) => {
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

  return (
    <Post
      key={post.postId}
      postRelativeTimestamp={getRelativeTimestamp(post.creationTimestamp)}
      post={post}
      authorUserName={user.username}
      authorUserAvatar={user.profilePictureTemporaryUrl}
      handleClickOfLikeButton={handleClickOfLikeButton}
      menuOptions={[firstMenuOption]}
    />
  );
};
