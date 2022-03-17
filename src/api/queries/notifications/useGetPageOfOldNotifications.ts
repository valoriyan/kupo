import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api } from "../..";

export const useGetPageOfOldNotifications = () => {
  return useInfiniteQuery([CacheKeys.OldNotificationPages], fetchPageOfOldNotifications, {
    getNextPageParam: (lastPage) => {
      return lastPage.nextPageCursor;
    },
  });
};

async function fetchPageOfOldNotifications({ pageParam = undefined }) {
  const res = await Api.getPageOfNotifications({ cursor: pageParam, pageSize: 5 });
  if (res.data && res.data.success) {
    return res.data.success;
  }

  throw new Error(res.data.error?.reason ?? "Failed to fetch notifications");
}
