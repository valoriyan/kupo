import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, SuccessfulGetPageOfChatRoomsResponse } from "../..";

export const useGetPageOfChatRooms = () => {
  return useInfiniteQuery<
    SuccessfulGetPageOfChatRoomsResponse,
    Error,
    SuccessfulGetPageOfChatRoomsResponse,
    (string | undefined)[]
  >([CacheKeys.ChatRoomsPages], fetchPageOfChatRooms, {
    getNextPageParam: (lastPage) => {
      return lastPage.nextPageCursor;
    },
  });
};

async function fetchPageOfChatRooms({ pageParam = undefined }) {
  const res = await Api.getPageOfChatRooms({ cursor: pageParam, pageSize: 25 });

  if (res.data.success) return res.data.success;
  throw new Error(res.data.error?.reason ?? "Unknown Error");
}
