import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, GetPageOfChatRoomsSuccess } from "../..";

export interface GetPageOfChatRoomsArgs {
  query: string;
  cursor?: string | undefined;
}

export const useGetPageOfChatRooms = ({ query }: GetPageOfChatRoomsArgs) => {
  return useInfiniteQuery<
    GetPageOfChatRoomsSuccess,
    Error,
    GetPageOfChatRoomsSuccess,
    (string | undefined)[]
  >(
    [CacheKeys.ChatRoomsPages, query],
    ({ pageParam = undefined }) => fetchPageOfChatRooms({ cursor: pageParam, query }),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.nextPageCursor;
      },
    },
  );
};

async function fetchPageOfChatRooms({ cursor, query }: GetPageOfChatRoomsArgs) {
  const res = await Api.getPageOfChatRooms({ query, cursor, pageSize: 25 });

  if (res.data.success) return res.data.success;
  throw new Error(res.data.error?.reason ?? "Unknown Error");
}
