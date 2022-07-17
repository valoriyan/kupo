import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, GetPageOfNotificationsSuccess } from "../..";

export const useGetPageOfOldNotifications = () => {
  return useInfiniteQuery<
    GetPageOfNotificationsSuccess,
    Error,
    GetPageOfNotificationsSuccess
  >([CacheKeys.OldNotificationPages], fetchPageOfOldNotifications, {
    getNextPageParam: (lastPage) => {
      return lastPage.nextPageCursor;
    },
  });
};

async function fetchPageOfOldNotifications({ pageParam = undefined }) {
  const res = await Api.getPageOfNotifications({
    cursor: pageParam,
    pageSize: 25,
    isUserReadingNotifications: true,
  });

  if (res.data && res.data.success) return res.data.success;
  throw new Error((res.data.error.reason as string) ?? "Failed to fetch notifications");
}
