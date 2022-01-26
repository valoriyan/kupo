import { InfiniteData, useMutation, useQueryClient } from "react-query";
import { ContentFilter } from "#/api/queries/feed/useGetContentFilters";
import { Api, SuccessfulGetPageOfPostsPaginationResponse } from "../..";
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
  contentFilter?: ContentFilter;
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
        console.log("HIT");
        console.log("data", data);
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
