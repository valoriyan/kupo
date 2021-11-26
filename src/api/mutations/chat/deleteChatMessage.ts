import { InfiniteData, useMutation, useQueryClient } from "react-query";
import { Api, SuccessfulGetPageOfChatMessagesResponse } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";

export const useDeleteChatMessage = ({ chatRoomId }: { chatRoomId: string }) => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({
      chatMessageId,
      isInformedByWebsocketMessage,
    }: {
      chatMessageId: string;
      isInformedByWebsocketMessage: boolean;
    }) => {
      if (!isInformedByWebsocketMessage) {
        await Api.deleteChatMessage({ chatMessageId });
      }

      return chatMessageId;
    },
    {
      onSuccess: (deletedChatMessageId) => {
        queryClient.setQueryData<InfiniteData<SuccessfulGetPageOfChatMessagesResponse>>(
          [CacheKeys.ChatRoomMessagePages, chatRoomId],
          (queriedData): InfiniteData<SuccessfulGetPageOfChatMessagesResponse> => {
            if (!!queriedData) {
              const updatedPages = queriedData.pages.map((page) => {
                const filteredChatMessages = page.chatMessages.filter(
                  (chatMessage) => chatMessage.chatMessageId !== deletedChatMessageId,
                );
                return {
                  ...page,
                  chatMessages: filteredChatMessages,
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
      },
    },
  );
};
