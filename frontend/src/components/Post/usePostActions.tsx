import { RenderablePost, RenderableShopItem } from "#/api";
import { useLikePublishedItem } from "#/api/mutations/posts/likePublishedItem";
import { useSavePublishedItem } from "#/api/mutations/posts/savePublishedItem";
import { useUnlikePublishedItem } from "#/api/mutations/posts/unlikePublishedItem";
import { useUnsavePublishedItem } from "#/api/mutations/posts/unsavePublishedItem";
import { useGetUserByUserId } from "#/api/queries/users/useGetUserByUserId";
import { useCurrentUserId } from "#/contexts/auth";
import { InfoIcon, TrashIcon } from "../Icons";
import { openDeletePostModal } from "./DeletePost";

export const usePostActions = (post: RenderablePost | RenderableShopItem) => {
  const { id, authorUserId, isLikedByClient, isSavedByClient } = post;

  const userId = useCurrentUserId();
  const { data: user } = useGetUserByUserId({ userId: authorUserId });

  const { mutateAsync: likePost } = useLikePublishedItem({
    publishedItemId: id,
    authorUserId,
  });
  const { mutateAsync: unlikePost } = useUnlikePublishedItem({
    publishedItemId: id,
    authorUserId,
  });
  const { mutateAsync: savePost } = useSavePublishedItem({
    publishedItemId: id,
    authorUserId,
  });
  const { mutateAsync: unsavePost } = useUnsavePublishedItem({
    publishedItemId: id,
    authorUserId,
  });

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
        openDeletePostModal({ publishedItemId: id, authorUserId });
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
