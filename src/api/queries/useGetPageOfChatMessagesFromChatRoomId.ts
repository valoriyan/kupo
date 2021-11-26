// useGetPageOfChatMessagesFromChatRoomId

import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api } from "..";

export interface GetPageOfChatRoomsMessagesFromChatRoomIdArgs {
  chatRoomId: string;
}

async function fetchPageOfChatMessagesFromChatRoomId({
  chatRoomId,
  pageParam = undefined,
}: {
  chatRoomId: string;
  pageParam: string | undefined;
}) {
  const res = await Api.getPageOfChatMessages({
    chatRoomId: `${chatRoomId}`,
    cursor: pageParam,
    pageSize: 5,
  });
  if (res.data && res.data.success) {
    return res.data.success;
  }

  throw new Error(res.data.error?.reason);
}

export const useGetPageOfChatMessagesFromChatRoomId = ({
  chatRoomId,
}: GetPageOfChatRoomsMessagesFromChatRoomIdArgs) => {
  return useInfiniteQuery(
    [CacheKeys.chatRoomMessagePages, chatRoomId],
    ({ pageParam }) => fetchPageOfChatMessagesFromChatRoomId({ chatRoomId, pageParam }),
    {
      getPreviousPageParam: (lastPage) => lastPage.nextPageCursor,
    },
  );
};
