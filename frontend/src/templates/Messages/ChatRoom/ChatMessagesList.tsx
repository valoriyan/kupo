import { DateTime } from "luxon";
import { Fragment, useState } from "react";
import { RenderableChatMessage } from "#/api";
import { ReverseInfiniteList } from "#/components/InfiniteList";
import { Flex, Stack } from "#/components/Layout";
import { ScrollArea } from "#/components/ScrollArea";
import { Subtext } from "#/components/Typography";
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
        <Stack css={{ px: "$4", pt: "$2", pb: 0 }}>
          <ReverseInfiniteList
            scrollParent={listRef}
            hasNextPage={hasPreviousPage ?? false}
            isNextPageLoading={isFetchingPreviousPage}
            loadNextPage={fetchPreviousPage}
            data={chatMessages}
            renderItem={(index, message) => {
              const isClientMessage = message.authorUserId === clientUserId;
              const previousMessage = chatMessages[Number.MAX_SAFE_INTEGER - index - 1];

              const isDateTransition =
                previousMessage &&
                getCalendarDate(previousMessage.creationTimestamp) !==
                  getCalendarDate(message.creationTimestamp);

              return (
                <Fragment key={message.chatMessageId}>
                  {isDateTransition && (
                    <Flex css={{ pt: "$5", pb: "$4", justifyContent: "center" }}>
                      <Subtext css={{ color: "$secondaryText" }}>
                        {getCalendarDate(message.creationTimestamp)}
                      </Subtext>
                    </Flex>
                  )}
                  <Flex
                    css={{
                      pb: "$4",
                      justifyContent: isClientMessage ? "flex-end" : "flex-start",
                    }}
                  >
                    <ChatRoomMessage
                      message={message}
                      isClientMessage={isClientMessage}
                    />
                  </Flex>
                </Fragment>
              );
            }}
          />
        </Stack>
      )}
    </ScrollArea>
  );
};

const getCalendarDate = (timestamp: number) =>
  DateTime.fromMillis(timestamp).toLocaleString();
