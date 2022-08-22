import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, GetPageOfChatMessagesSuccess } from "../..";

export interface GetPageOfChatRoomsMessagesFromChatRoomIdArgs {
  chatRoomId: string;
}

export const useGetPageOfChatMessagesFromChatRoomId = ({
  chatRoomId,
}: GetPageOfChatRoomsMessagesFromChatRoomIdArgs) => {
  return useInfiniteQuery<
    GetPageOfChatMessagesSuccess,
    Error,
    GetPageOfChatMessagesSuccess,
    string[]
  >(
    [CacheKeys.ChatRoomMessagePages, chatRoomId],
    ({ pageParam }) => fetchPageOfChatMessagesFromChatRoomId({ chatRoomId, pageParam }),
    {
      getPreviousPageParam: (lastPage) => lastPage.previousPageCursor,
      enabled: !!chatRoomId,
    },
  );
};

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

  throw new Error(res.data.error.reason as string);
}
