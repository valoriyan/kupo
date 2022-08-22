import { InfiniteData, QueryClient } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { RenderablePublishedItem, GetPublishedItemsByUsernameSuccess } from "../..";

export const updateCachedPost = ({
  queryClient,
  authorUserId,
  publishedItemId,
  postUpdater,
}: {
  queryClient: QueryClient;
  authorUserId: string;
  publishedItemId: string;
  /** A function to update the post, or null if you want to remove the post from cache */
  postUpdater: ((oldPost: RenderablePublishedItem) => RenderablePublishedItem) | null;
}) => {
  const userPostsCacheKey = [CacheKeys.UserPostPages, authorUserId];
  const singlePostCacheKey = [CacheKeys.PostById, publishedItemId];

  const contentFeedQueries = queryClient.getQueriesData<
    InfiniteData<GetPublishedItemsByUsernameSuccess>
  >(CacheKeys.ContentFeed);
  const userPostsData =
    queryClient.getQueryData<InfiniteData<GetPublishedItemsByUsernameSuccess>>(
      userPostsCacheKey,
    );
  const singlePostData =
    queryClient.getQueryData<RenderablePublishedItem>(singlePostCacheKey);

  for (const [queryKey, queryData] of contentFeedQueries) {
    const updatedQueryData = {
      ...queryData,
      pages: queryData.pages.map((page) => ({
        ...page,
        publishedItems: postUpdater
          ? page.publishedItems.map((publishedItem) => {
              if (publishedItem.id === publishedItemId) return postUpdater(publishedItem);
              return publishedItem;
            })
          : page.publishedItems.filter(
              (publishedItem) => publishedItem.id !== publishedItemId,
            ),
      })),
    };
    queryClient.setQueryData(queryKey, updatedQueryData);
  }

  if (userPostsData) {
    const updatedUserPostsData = {
      ...userPostsData,
      pages: userPostsData.pages.map((page) => ({
        ...page,
        publishedItems: postUpdater
          ? page.publishedItems.map((publishedItem) => {
              if (publishedItem.id === publishedItemId) return postUpdater(publishedItem);
              return publishedItem;
            })
          : page.publishedItems.filter(
              (publishedItem) => publishedItem.id !== publishedItemId,
            ),
      })),
    };
    queryClient.setQueryData(userPostsCacheKey, updatedUserPostsData);
  }

  if (!postUpdater) {
    queryClient.removeQueries(singlePostCacheKey);
  } else if (singlePostData) {
    queryClient.setQueryData(singlePostCacheKey, postUpdater(singlePostData));
  }
};

export const resetPostFeeds = ({
  queryClient,
  authorUserId,
}: {
  queryClient: QueryClient;
  authorUserId?: string;
}) => {
  queryClient.resetQueries([CacheKeys.ContentFeed]);
  if (authorUserId) {
    queryClient.resetQueries([CacheKeys.UserPostPages, authorUserId]);
  }
};
