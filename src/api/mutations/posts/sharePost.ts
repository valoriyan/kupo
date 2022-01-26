import { InfiniteData, useMutation, useQueryClient } from "react-query";
import {
  Api,
  SuccessfulGetPageOfPostsPaginationResponse,
  UserContentFeedFilter,
} from "../..";
import {
  updateCurrentlyActivePostCacheForUserPosts,
  UpdateQueriedPostDataFunction,
} from "./utilities";

export const useSharePost = ({
  sharedPostId,
  authorUserId,
  contentFilter,
}: {
  sharedPostId: string;
  authorUserId: string;
  contentFilter?: UserContentFeedFilter;
}) => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ caption, hashtags }: { caption: string; hashtags: string[] }) => {
      return await Api.sharePost({
        sharedPostId,
        caption,
        hashtags,
      });
    },
    {
      onSuccess: (data) => {
        if (data.data.success) {
          const sharedPost = data.data.success.renderablePost;

          const updatePostCacheForDeleteOperation: UpdateQueriedPostDataFunction = (
            queriedData:
              | InfiniteData<SuccessfulGetPageOfPostsPaginationResponse>
              | undefined,
          ) => {
            if (!!queriedData) {
              return {
                pages: [{ posts: [sharedPost] }, ...queriedData.pages],
                pageParams: queriedData.pageParams,
              };
            } else {
              return {
                pages: [{ posts: [sharedPost] }],
                pageParams: [],
              };
            }
          };

          updateCurrentlyActivePostCacheForUserPosts({
            updateQueriedPostDataFunction: updatePostCacheForDeleteOperation,
            queryClient,
            authorUserId,
            contentFilter,
          });
        }
      },
    },
  );
};
