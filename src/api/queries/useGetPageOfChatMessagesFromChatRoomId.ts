// useGetPageOfChatMessagesFromChatRoomId


import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api } from "..";

export interface GetPageOfChatRoomsMessagesFromChatRoomIdArgs {
  cursor?: string;
  chatRoomId: string;
}

async function fetchPageOfChatMessagesFromChatRoomId({ chatRoomId, pageParam = undefined }: {chatRoomId: string; pageParam: string | undefined}) {
  const res = await Api.getPageOfChatMessages({ chatRoomId: `${chatRoomId}`, cursor: pageParam, pageSize: 5 });
  return res.data;
}

export const useGetPageOfChatMessagesFromChatRoomId = ({ chatRoomId, cursor }: GetPageOfChatRoomsMessagesFromChatRoomIdArgs) => {
  return useInfiniteQuery([CacheKeys.chatRoomMessages, chatRoomId, cursor], ({pageParam}) => fetchPageOfChatMessagesFromChatRoomId({chatRoomId, pageParam}), {
    getNextPageParam: (lastPage) => {
      return lastPage.success?.nextPageCursor;
    },
  });
};
