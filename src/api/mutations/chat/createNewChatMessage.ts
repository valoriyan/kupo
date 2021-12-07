import { InfiniteData, useMutation, useQueryClient } from "react-query";
import { Api, SuccessfulGetPageOfChatMessagesResponse } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";

export const useCreateNewChatMessage = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({
      chatMessageText,
      chatRoomId,
    }: {
      chatMessageText: string;
      chatRoomId: string;
    }) => {
      return await Api.createChatMessage({
        chatMessageText,
        chatRoomId,
      });
    },
    {
      onSuccess: (data) => {
        if (data.data.success) {
          const createdChatMessage = data.data.success.chatMessage;
          const { chatRoomId } = createdChatMessage;

          queryClient.setQueryData<InfiniteData<SuccessfulGetPageOfChatMessagesResponse>>(
            [CacheKeys.ChatRoomMessagePages, chatRoomId],
            (queriedData): InfiniteData<SuccessfulGetPageOfChatMessagesResponse> => {
              if (!!queriedData) {
                const updatedPages = queriedData.pages.map((page, index) => {
                  if (index < queriedData.pages.length - 1) {
                    return page;
                  }

                  const existingChatMessageIds = page.chatMessages.map(
                    (chatMessage) => chatMessage.chatMessageId,
                  );

                  const updatedChatMessages = !existingChatMessageIds.includes(
                    createdChatMessage.chatMessageId,
                  )
                    ? [...page.chatMessages, createdChatMessage]
                    : page.chatMessages;

                  return {
                    ...page,
                    chatMessages: updatedChatMessages,
                  };
                });

                return {
                  pages: updatedPages,
                  pageParams: queriedData.pageParams,
                };
              }

              return {
                pages: [],
                pageParams: [],
              };
            },
          );
        }
      },
    },
  );
};
