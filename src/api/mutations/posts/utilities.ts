import { InfiniteData, QueryClient } from "react-query";
import { ContentFilter } from "#/api/queries/feed/useGetContentFilters";
import { CacheKeys } from "#/contexts/queryClient";
import { SuccessfulGetPageOfPostsPaginationResponse } from "../..";

export type UpdateQueriedPostDataFunction = (
  queriedData: InfiniteData<SuccessfulGetPageOfPostsPaginationResponse> | undefined,
) => InfiniteData<SuccessfulGetPageOfPostsPaginationResponse>;

const updatePostCacheForContentFeed = ({
  updateQueriedPostDataFunction,
  queryClient,
  contentFilter,
}: {
  updateQueriedPostDataFunction: UpdateQueriedPostDataFunction;
  queryClient: QueryClient;
  contentFilter: ContentFilter;
}) => {
  const queryKey = [CacheKeys.ContentFeed, contentFilter?.type, contentFilter?.value];

  queryClient.setQueryData<InfiniteData<SuccessfulGetPageOfPostsPaginationResponse>>(
    queryKey,
    updateQueriedPostDataFunction,
  );
};

const updatePostCacheForUserPosts = ({
  updateQueriedPostDataFunction,
  queryClient,
  authorUserId,
}: {
  updateQueriedPostDataFunction: UpdateQueriedPostDataFunction;
  queryClient: QueryClient;
  authorUserId: string;
}) => {
  const queryKey = [CacheKeys.UserPostPages, authorUserId];

  queryClient.setQueryData<InfiniteData<SuccessfulGetPageOfPostsPaginationResponse>>(
    queryKey,
    updateQueriedPostDataFunction,
  );
};

export const updateCurrentlyActivePostCacheForUserPosts = ({
  updateQueriedPostDataFunction,
  queryClient,
  authorUserId,
  contentFilter,
}: {
  updateQueriedPostDataFunction: UpdateQueriedPostDataFunction;
  queryClient: QueryClient;
  authorUserId: string;
  contentFilter?: ContentFilter;
}) => {
  if (!!contentFilter) {
    console.log("RIGHT ONE WAS HIT");
    updatePostCacheForContentFeed({
      updateQueriedPostDataFunction,
      queryClient,
      contentFilter,
    });
  } else {
    console.log("WRONG ONE WAS HIT");
    updatePostCacheForUserPosts({
      updateQueriedPostDataFunction,
      queryClient,
      authorUserId,
    });
  }
};
