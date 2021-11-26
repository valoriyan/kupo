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
      console.log("useCreateNewChatMessageInNewChatRoom");
      console.log(chatMessageText);
      console.log(userIds);

      const res = await Api.createChatMessageInNewChatRoom({
        chatMessageText,
        userIds,
      });

      if (res.data && !!res.data.success) {
        return res.data.success.chatRoomId;
      }
      throw new Error(res.data.error?.reason);
    },
  );
};
