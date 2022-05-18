import { useMutation } from "react-query";
import { Api } from "#/api";

export const useCreateNewChatMessageInNewChatRoom = () => {
  return useMutation(
    async ({
      chatMessageText,
      userIds,
    }: {
      chatMessageText: string;
      userIds: string[];
    }) => {
      const res = await Api.createChatMessageInNewChatRoom({ chatMessageText, userIds });

      if (res.data.success) return res.data.success.chatRoomId;

      throw new Error(res.data.error?.reason ?? "Failed to create new chat room");
    },
  );
};
