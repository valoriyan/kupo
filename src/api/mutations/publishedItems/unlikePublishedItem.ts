import { useMutation, useQueryClient } from "react-query";
import { Api } from "../..";
import { updateCachedPost } from "../posts/utilities";

export const useUnlikePublishedItem = ({
  publishedItemId,
  authorUserId,
}: {
  publishedItemId: string;
  authorUserId: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      return await Api.removeUserLikeFromPublishedItem({ publishedItemId });
    },
    {
      onSuccess: () => {
        updateCachedPost({
          queryClient,
          authorUserId,
          postId: publishedItemId,
          postUpdater: (prev) => ({
            ...prev,
            isLikedByClient: false,
            likes: {
              count: prev.likes.count - 1,
            },
          }),
        });
      },
    },
  );
};
