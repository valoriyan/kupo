import { useMutation, useQueryClient } from "react-query";
import { Api } from "../..";
import { updateCachedPost } from "./utilities";

export const useUnlikePost = ({
  postId,
  authorUserId,
}: {
  postId: string;
  authorUserId: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      return await Api.removeUserLikeFromPost({ postId });
    },
    {
      onSuccess: () => {
        updateCachedPost({
          queryClient,
          authorUserId,
          postId,
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
