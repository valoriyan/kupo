import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api } from "../..";

export const useGetChatRoomById = ({ chatRoomId }: { chatRoomId: string }) => {
  return useQuery(
    [CacheKeys.ChatRoomFromId, chatRoomId],
    async () => {
      const res = await Api.getChatRoomById({ chatRoomId });

      if (!!res.data.success) {
        return res.data.success.chatRoom;
      }
      throw new Error(res.data.error!.reason);
    },
    { enabled: !!chatRoomId },
  );
};
