import { QueryClient } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";

export const resetShopItemFeeds = ({
  queryClient,
  authorUserId,
}: {
  queryClient: QueryClient;
  authorUserId?: string;
}) => {
  queryClient.resetQueries([CacheKeys.ContentFeed]);
  if (authorUserId) {
    // TODO: Change to user shop item feed
    queryClient.resetQueries([CacheKeys.UserPostPages, authorUserId]);
  }
};
