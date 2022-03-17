import { useMutation, useQueryClient } from "react-query";
import { Api } from "../..";
import { invalidatePostFeeds } from "./utilities";

export const useSharePost = ({ postId }: { postId: string }) => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ caption, hashtags }: { caption: string; hashtags: string[] }) => {
      return await Api.sharePost({
        sharedPostId: postId,
        caption,
        hashtags,
      });
    },
    {
      onSuccess: (data) => {
        if (data.data.success) {
          invalidatePostFeeds({
            queryClient,
            authorUserId: data.data.success.renderablePost.authorUserId,
          });
        }
      },
    },
  );
};
