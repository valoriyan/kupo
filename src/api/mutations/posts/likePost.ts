import { useMutation, useQueryClient } from "react-query";
import { Api } from "../..";
import { updateCachedPost } from "./utilities";

export const useLikePost = ({
  postId,
  authorUserId,
}: {
  postId: string;
  authorUserId: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      return await Api.userLikesPost({ postId });
    },
    {
      onSuccess: () => {
        updateCachedPost({
          queryClient,
          authorUserId,
          postId,
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
