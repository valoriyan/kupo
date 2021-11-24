import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api } from "..";

export interface GetChatRoomsArgs {
  cursor?: string;
}

async function fetchPageOfChatRooms({ pageParam = undefined }) {
  const res = await Api.getPageOfChatRooms({ cursor: pageParam, pageSize: 5 });
  return res.data;
}

export const useGetChatRooms = ({ cursor }: GetChatRoomsArgs) => {
  return useInfiniteQuery([CacheKeys.chatRooms, cursor], fetchPageOfChatRooms, {
    getNextPageParam: (lastPage) => {
      console.log("lastPage", lastPage);
      return lastPage.success?.nextPageCursor;
    },
  });
};
