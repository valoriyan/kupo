import { RenderablePost, UserContentFeedFilter } from "#/api";
import { useDeletePost } from "#/api/mutations/posts/deletePost";
import { useLikePost } from "#/api/mutations/posts/likePost";
import { useUnlikePost } from "#/api/mutations/posts/unlikePost";
import { useSharePost } from "#/api/mutations/posts/sharePost";
import { useGetUserByUserId } from "#/api/queries/users/useGetUserByUserId";
import { InfoIcon, TrashIcon } from "#/components/Icons";
import { Post } from "#/components/Post";
import { useCurrentUserId } from "#/contexts/auth";

export interface PostWrapperProps {
  post: RenderablePost;
  contentFilter: UserContentFeedFilter;
}

export const PostWrapper = ({ post, contentFilter }: PostWrapperProps) => {
  const { isLikedByClient, postId, authorUserId } = post;
  const userId = useCurrentUserId();
  const {
    data: user,
    isLoading,
    error,
    isError,
  } = useGetUserByUserId({ userId: authorUserId });

  const { mutateAsync: likePost } = useLikePost({
    postId,
    authorUserId,
    contentFilter,
  });
  const { mutateAsync: unlikePost } = useUnlikePost({
    postId,
    authorUserId,
    contentFilter,
  });
  const { mutateAsync: deletePost } = useDeletePost({
    postId,
    authorUserId,
    contentFilter,
  });
  const { mutateAsync: sharePost } = useSharePost({
    sharedPostId: postId,
    authorUserId,
    contentFilter,
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

  async function handleClickOfShareButton() {
    sharePost({
      caption: "I want to share this!",
      hashtags: ["shared"],
    });
  }

  const menuActions = [];

  if (userId === authorUserId) {
    menuActions.push({
      Icon: TrashIcon,
      iconColor: "$failure",
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
      key={postId}
      post={post}
      authorUserName={user.username}
      authorUserAvatar={user.profilePictureTemporaryUrl}
      handleClickOfLikeButton={handleClickOfLikeButton}
      handleClickOfShareButton={handleClickOfShareButton}
      menuActions={menuActions}
    />
  );
};
