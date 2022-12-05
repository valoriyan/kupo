import { useEffect, useRef } from "react";
import { RenderableChatMessage } from "#/api";
import { InfiniteList } from "#/components/InfiniteList";
import { Flex, Stack } from "#/components/Layout";
import { ScrollArea } from "#/components/ScrollArea";
import { ChatRoomMessage } from "./ChatRoomMessage";

export interface ChatMessagesListProps {
  clientUserId: string;
  chatMessages: RenderableChatMessage[];
  hasPreviousPage: boolean | undefined;
  isFetchingPreviousPage: boolean;
  fetchPreviousPage: () => void;
}

export const ChatMessagesList = ({
  clientUserId,
  chatMessages,
  hasPreviousPage,
  isFetchingPreviousPage,
  fetchPreviousPage,
}: ChatMessagesListProps) => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, []);

  return (
    <ScrollArea ref={listRef}>
      <Stack css={{ p: "$4", pb: 0 }}>
        <InfiniteList
          hasNextPage={hasPreviousPage ?? false}
          isNextPageLoading={isFetchingPreviousPage}
          loadNextPage={fetchPreviousPage}
          data={chatMessages}
          renderItem={(index, message) => {
            const isClientMessage = message.authorUserId === clientUserId;

            return (
              <Flex
                key={message.chatMessageId}
                css={{
                  pb: "$4",
                  justifyContent: isClientMessage ? "flex-end" : "flex-start",
                }}
              >
                <ChatRoomMessage message={message} isClientMessage={isClientMessage} />
              </Flex>
            );
          }}
        />
      </Stack>
    </ScrollArea>
  );
};
