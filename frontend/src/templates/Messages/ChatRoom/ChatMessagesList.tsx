import { useState } from "react";
import { RenderableChatMessage } from "#/api";
import { ReverseInfiniteList } from "#/components/InfiniteList";
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
  const [listRef, setListRef] = useState<HTMLDivElement | null>(null);

  return (
    <ScrollArea ref={setListRef}>
      {listRef && (
        <Stack css={{ p: "$4", pb: 0 }}>
          <ReverseInfiniteList
            scrollParent={listRef}
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
      )}
    </ScrollArea>
  );
};
