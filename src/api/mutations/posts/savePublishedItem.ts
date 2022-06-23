import { useMutation, useQueryClient } from "react-query";
import { Api } from "../..";
import { updateCachedPost } from "./utilities";

export const useSavePublishedItem = ({
  publishedItemId,
  authorUserId,
}: {
  publishedItemId: string;
  authorUserId: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      return await Api.userSavesPublishedItem({ publishedItemId });
    },
    {
      onSuccess: () => {
        updateCachedPost({
          queryClient,
          authorUserId,
          postId: publishedItemId,
          postUpdater: (prev) => ({
            ...prev,
            isSavedByClient: true,
          }),
        });
      },
    },
  );
};
