import { RenderablePost } from "#/api";
import { useDeletePost } from "#/api/mutations/posts/deletePost";
import { useLikePost } from "#/api/mutations/posts/likePost";
import { useSharePost } from "#/api/mutations/posts/sharePost";
import { useUnlikePost } from "#/api/mutations/posts/unlikePost";
import { useGetUserByUserId } from "#/api/queries/users/useGetUserByUserId";
import { useCurrentUserId } from "#/contexts/auth";
import { TrashIcon, InfoIcon } from "../Icons";

export const usePostActions = (post: RenderablePost) => {
  const { postId, authorUserId, isLikedByClient, shared } = post;

  const userId = useCurrentUserId();
  const { data: user } = useGetUserByUserId({ userId: authorUserId });

  const { mutateAsync: likePost } = useLikePost({ postId, authorUserId });
  const { mutateAsync: unlikePost } = useUnlikePost({ postId, authorUserId });
  const { mutateAsync: deletePost } = useDeletePost({ postId, authorUserId });
  const { mutateAsync: sharePost } = useSharePost({
    postId: shared?.post.postId ?? postId,
  });

  async function handleClickOfLikeButton() {
    if (isLikedByClient) unlikePost();
    else likePost();
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

  return {
    handleClickOfLikeButton,
    handleClickOfShareButton,
    menuActions,
    user,
  };
};
