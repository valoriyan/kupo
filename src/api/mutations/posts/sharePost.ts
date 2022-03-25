import { useMutation, useQueryClient } from "react-query";
import { Api, SharePostRequestBody } from "../..";
import { invalidatePostFeeds } from "./utilities";

export const useSharePost = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (requestBody: SharePostRequestBody) => {
      return await Api.sharePost(requestBody);
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
