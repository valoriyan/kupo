import { InfiniteData, QueryClient } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { SuccessfulGetPageOfPostsPaginationResponse, UserContentFeedFilter } from "../..";

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
  contentFilter: UserContentFeedFilter;
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
  contentFilter?: UserContentFeedFilter;
}) => {
  if (!!contentFilter) {
    updatePostCacheForContentFeed({
      updateQueriedPostDataFunction,
      queryClient,
      contentFilter,
    });
  } else {
    updatePostCacheForUserPosts({
      updateQueriedPostDataFunction,
      queryClient,
      authorUserId,
    });
  }
};
