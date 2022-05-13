import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api } from "../..";

export const useGetCountOfUnreadNotifications = () => {
  return useQuery<number, Error>([CacheKeys.CountOfUnreadNotifications], async () => {
    const res = await Api.getCountOfUnreadNotifications();

    if (res.data.success) {
      return res.data.success.count;
    }
    throw new Error(
      res.data.error?.reason ?? "Failed to get count of unread notifications",
    );
  });
};
