import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api } from "../..";

export interface GetChatRoomsArgs {
  cursor?: string;
}

export const useGetPageOfChatRooms = ({ cursor }: GetChatRoomsArgs) => {
  return useInfiniteQuery([CacheKeys.ChatRoomsPages, cursor], fetchPageOfChatRooms, {
    getNextPageParam: (lastPage) => {
      return lastPage.success?.nextPageCursor;
    },
  });
};

async function fetchPageOfChatRooms({ pageParam = undefined }) {
  const res = await Api.getPageOfChatRooms({ cursor: pageParam, pageSize: 5 });
  return res.data;
}
