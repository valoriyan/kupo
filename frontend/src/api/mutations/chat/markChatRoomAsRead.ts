import { useMutation, useQueryClient } from "react-query";
import { Api } from "../..";
import { CacheKeys } from "#/contexts/queryClient";

export const useMarkChatRoomAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (chatRoomId: string) => {
      return await Api.markChatRoomAsRead({ chatRoomId });
    },
    {
      onSuccess: (data) => {
        if (data.data.success) {
          const countOfUnreadChatRooms = data.data.success.countOfUnreadChatRooms;

          queryClient.setQueryData(
            CacheKeys.CountOfUnreadChatRooms,
            countOfUnreadChatRooms,
          );
        }
      },
    },
  );
};
