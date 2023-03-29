import { InfiniteData, QueryClient } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import {
  RenderablePublishedItem,
  GetPublishedItemsByUsernameSuccess,
  GetSavedPublishedItemsSuccess,
} from "../..";

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
  const userShopItemsCacheKey = [CacheKeys.UserShopItemPages, authorUserId];
  const singlePostCacheKey = [CacheKeys.PostById, publishedItemId];
  const savedPostsCacheKey = [CacheKeys.SavedPosts];

  const contentFeedQueries = queryClient.getQueriesData<
    InfiniteData<GetPublishedItemsByUsernameSuccess>
  >(CacheKeys.ContentFeed);
  const userPostsData =
    queryClient.getQueryData<InfiniteData<GetPublishedItemsByUsernameSuccess>>(
      userPostsCacheKey,
    );
  const userShopItemsData =
    queryClient.getQueryData<InfiniteData<GetPublishedItemsByUsernameSuccess>>(
      userShopItemsCacheKey,
    );
  const singlePostData =
    queryClient.getQueryData<RenderablePublishedItem>(singlePostCacheKey);
  const savedPostsData =
    queryClient.getQueryData<InfiniteData<GetSavedPublishedItemsSuccess>>(
      savedPostsCacheKey,
    );

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

  if (userShopItemsData) {
    const updatedUserShopItemsData = {
      ...userShopItemsData,
      pages: userShopItemsData.pages.map((page) => ({
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
    queryClient.setQueryData(userShopItemsCacheKey, updatedUserShopItemsData);
  }

  if (savedPostsData) {
    const updatedSavedPostsData = {
      ...savedPostsData,
      pages: savedPostsData.pages.map((page) => ({
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
    queryClient.setQueryData(savedPostsCacheKey, updatedSavedPostsData);
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
  queryClient.resetQueries([CacheKeys.SavedPosts]);
  if (authorUserId) {
    queryClient.resetQueries([CacheKeys.UserPostPages, authorUserId]);
    queryClient.resetQueries([CacheKeys.UserShopItemPages, authorUserId]);
  }
};
