import { useMutation, useQueryClient } from "react-query";
import { Api } from "../..";
import { updateCachedPost } from "./utilities";

export const useSavePost = ({
  postId,
  authorUserId,
}: {
  postId: string;
  authorUserId: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      return await Api.userSavesPost({ postId });
    },
    {
      onSuccess: () => {
        updateCachedPost({
          queryClient,
          authorUserId,
          postId,
          postUpdater: (prev) => ({
            ...prev,
            isSavedByClient: true,
          }),
        });
      },
    },
  );
};
