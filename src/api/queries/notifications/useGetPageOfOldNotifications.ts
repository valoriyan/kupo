import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, SuccessfullyGotPageOfNotificationsResponse } from "../..";

export const useGetPageOfOldNotifications = () => {
  return useInfiniteQuery<
    SuccessfullyGotPageOfNotificationsResponse,
    Error,
    SuccessfullyGotPageOfNotificationsResponse
  >([CacheKeys.OldNotificationPages], fetchPageOfOldNotifications, {
    getNextPageParam: (lastPage) => {
      return lastPage.nextPageCursor;
    },
  });
};

async function fetchPageOfOldNotifications({ pageParam = undefined }) {
  const res = await Api.getPageOfNotifications({ cursor: pageParam, pageSize: 25 });

  if (res.data && res.data.success) return res.data.success;
  throw new Error(res.data.error?.reason ?? "Failed to fetch notifications");
}
