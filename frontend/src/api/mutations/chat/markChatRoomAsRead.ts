import { useMutation, useQueryClient } from "react-query";
import { useWebsocketState } from "#/components/AppLayout/WebsocketContext";
import { CacheKeys } from "#/contexts/queryClient";
import { Api } from "../..";

export const useMarkChatRoomAsRead = () => {
  const queryClient = useQueryClient();
  const updateCountOfUnreadChatRooms = useWebsocketState(
    (store) => store.updateCountOfUnreadChatRooms,
  );

  return useMutation(
    async (chatRoomId: string) => {
      return await Api.markChatRoomAsRead({ chatRoomId });
    },
    {
      onSuccess: (data) => {
        if (data.data.success) {
          const { countOfUnreadChatRooms } = data.data.success;

          updateCountOfUnreadChatRooms(countOfUnreadChatRooms);
          queryClient.setQueryData(
            CacheKeys.CountOfUnreadChatRooms,
            countOfUnreadChatRooms,
          );
        }
      },
    },
  );
};
