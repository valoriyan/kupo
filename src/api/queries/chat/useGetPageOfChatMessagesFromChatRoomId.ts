import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, SuccessfulGetPageOfChatMessagesResponse } from "../..";

export interface GetPageOfChatRoomsMessagesFromChatRoomIdArgs {
  chatRoomId: string;
}

export const useGetPageOfChatMessagesFromChatRoomId = ({
  chatRoomId,
}: GetPageOfChatRoomsMessagesFromChatRoomIdArgs) => {
  return useInfiniteQuery<
    SuccessfulGetPageOfChatMessagesResponse,
    Error,
    SuccessfulGetPageOfChatMessagesResponse,
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
    pageSize: 20,
  });
  if (res.data && res.data.success) {
    return res.data.success;
  }

  throw new Error(res.data.error?.reason);
}
