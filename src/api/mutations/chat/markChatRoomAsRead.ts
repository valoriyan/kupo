import { useMutation } from "react-query";
import { Api } from "../..";

export const useMarkChatRoomAsRead = () => {
  return useMutation(async ({ chatRoomId }: { chatRoomId: string }) => {
    return await Api.markChatRoomAsRead({ chatRoomId });
  });
};
