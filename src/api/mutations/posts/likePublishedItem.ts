import { useMutation, useQueryClient } from "react-query";
import { Api } from "../..";
import { updateCachedPost } from "./utilities";

export const useLikePublishedItem = ({
  publishedItemId,
  authorUserId,
}: {
  publishedItemId: string;
  authorUserId: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      return await Api.userLikesPublishedItem({ publishedItemId });
    },
    {
      onSuccess: () => {
        updateCachedPost({
          queryClient,
          authorUserId,
          postId: publishedItemId,
          postUpdater: (prev) => ({
            ...prev,
            isLikedByClient: true,
            likes: {
              count: prev.likes.count + 1,
            },
          }),
        });
      },
    },
  );
};
