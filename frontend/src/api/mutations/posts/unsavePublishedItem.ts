import { useMutation, useQueryClient } from "react-query";
import { Api } from "../..";
import { updateCachedPost } from "./utilities";

export const useUnsavePublishedItem = ({
  publishedItemId,
  authorUserId,
}: {
  publishedItemId: string;
  authorUserId: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      return await Api.userUnsavesPublishedItem({ publishedItemId });
    },
    {
      onSuccess: () => {
        updateCachedPost({
          queryClient,
          authorUserId,
          publishedItemId,
          postUpdater: (prev) => ({
            ...prev,
            isSavedByClient: false,
          }),
        });
      },
    },
  );
};
