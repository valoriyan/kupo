import { RenderablePost } from "#/api";
import { useDeletePost } from "#/api/mutations/posts/deletePost";
import { useLikePost } from "#/api/mutations/posts/likePost";
import { useSharePost } from "#/api/mutations/posts/sharePost";
import { useUnlikePost } from "#/api/mutations/posts/unlikePost";
import { useGetUserByUserId } from "#/api/queries/users/useGetUserByUserId";
import { InfoIcon, TrashIcon } from "#/components/Icons";
import { Post } from "#/components/Post";
import { useCurrentUserId } from "#/contexts/auth";

export interface PostWrapperProps {
  post: RenderablePost;
  handleClickOfCommentsButton?: () => void;
}

export const PostWrapper = ({ post, handleClickOfCommentsButton }: PostWrapperProps) => {
  const { isLikedByClient, postId, authorUserId } = post;
  const userId = useCurrentUserId();
  const { data: user } = useGetUserByUserId({ userId: authorUserId });

  const { mutateAsync: likePost } = useLikePost({ postId, authorUserId });
  const { mutateAsync: unlikePost } = useUnlikePost({ postId, authorUserId });
  const { mutateAsync: deletePost } = useDeletePost({ postId, authorUserId });
  const { mutateAsync: sharePost } = useSharePost({ postId });

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
      authorUserName={user?.username}
      authorUserAvatar={user?.profilePictureTemporaryUrl}
      handleClickOfLikeButton={handleClickOfLikeButton}
      handleClickOfShareButton={handleClickOfShareButton}
      handleClickOfCommentsButton={handleClickOfCommentsButton}
      menuActions={menuActions}
    />
  );
};
