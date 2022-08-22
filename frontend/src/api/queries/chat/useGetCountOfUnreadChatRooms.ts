import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api } from "../..";

export const useGetCountOfUnreadChatRooms = () => {
  return useQuery<number, Error>([CacheKeys.CountOfUnreadChatRooms], async () => {
    const res = await Api.getCountOfUnreadChatRooms({});

    if (res.data.success) {
      return res.data.success.count;
    }
    throw new Error(
      (res.data.error.reason as string) ?? "Failed to get count of unread chat rooms",
    );
  });
};
