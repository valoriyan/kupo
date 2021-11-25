import { useMutation } from "react-query";
import { Api } from "#/api";

export const useCreateNewChatMessage = () => {

  return useMutation(
    async ({
      chatMessageText,
      chatRoomId,
    }: {
      chatMessageText: string;
      chatRoomId: string;
    }) => {
      return await Api.createChatMessage(
        {
          chatMessageText,
          chatRoomId,
        },
      );
    },
    {
      onSuccess: (data) => {
        if (data.data.success) {
          console.log(data.data.success);
        }
      },
    },
  );
};
