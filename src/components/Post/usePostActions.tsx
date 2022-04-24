import { RenderablePost } from "#/api";
import { useDeletePost } from "#/api/mutations/posts/deletePost";
import { useLikePost } from "#/api/mutations/posts/likePost";
import { useSavePost } from "#/api/mutations/posts/savePost";
import { useUnlikePost } from "#/api/mutations/posts/unlikePost";
import { useUnsavePost } from "#/api/mutations/posts/unsavePost";
import { useGetUserByUserId } from "#/api/queries/users/useGetUserByUserId";
import { useCurrentUserId } from "#/contexts/auth";
import { InfoIcon, TrashIcon } from "../Icons";

export const usePostActions = (post: RenderablePost) => {
  const { postId, authorUserId, isLikedByClient, isSavedByClient } = post;

  const userId = useCurrentUserId();
  const { data: user } = useGetUserByUserId({ userId: authorUserId });

  const { mutateAsync: likePost } = useLikePost({ postId, authorUserId });
  const { mutateAsync: unlikePost } = useUnlikePost({ postId, authorUserId });
  const { mutateAsync: savePost } = useSavePost({ postId, authorUserId });
  const { mutateAsync: unsavePost } = useUnsavePost({ postId, authorUserId });
  const { mutateAsync: deletePost } = useDeletePost({ postId, authorUserId });

  async function handleLikeButton() {
    if (isLikedByClient) unlikePost();
    else likePost();
  }

  async function handleSaveButton() {
    if (isSavedByClient) unsavePost();
    else savePost();
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
    handleLikeButton,
    handleSaveButton,
    menuActions,
    user,
  };
};
