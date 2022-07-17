import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, RenderableChatRoomPreview } from "../..";

export const useGetChatRoomById = ({ chatRoomId }: { chatRoomId: string }) => {
  return useQuery<RenderableChatRoomPreview, Error>(
    [CacheKeys.ChatRoomFromId, chatRoomId],
    async () => {
      const res = await Api.getChatRoomById({ chatRoomId });

      if (res.data.success) {
        return res.data.success.chatRoom;
      }
      throw new Error((res.data.error.reason as string) ?? "Failed to fetch chat room");
    },
    { enabled: !!chatRoomId },
  );
};
