import { DateTime } from "luxon";
import { Fragment } from "react";
import { RenderableChatMessage, RenderableUser } from "#/api";
import { ReverseInfiniteList } from "#/components/InfiniteList";
import { Flex, Stack } from "#/components/Layout";
import { Subtext } from "#/components/Typography";
import { ChatRoomMessage } from "./ChatRoomMessage";

export interface ChatMessagesListProps {
  clientUserId: string;
  chatMessages: RenderableChatMessage[];
  hasPreviousPage: boolean | undefined;
  isFetchingPreviousPage: boolean;
  fetchPreviousPage: () => void;
  isGroupChat: boolean;
  memberMap: Record<string, RenderableUser>;
}

export const ChatMessagesList = ({
  clientUserId,
  chatMessages,
  hasPreviousPage,
  isFetchingPreviousPage,
  fetchPreviousPage,
  isGroupChat,
  memberMap,
}: ChatMessagesListProps) => {
  return (
    <Stack css={{ px: "$4", py: "$2", pt: "$10", pb: "$12" }}>
      <ReverseInfiniteList
        hasNextPage={hasPreviousPage ?? false}
        isNextPageLoading={isFetchingPreviousPage}
        loadNextPage={fetchPreviousPage}
        data={chatMessages}
        renderItem={(index, message) => {
          const isClientMessage = message.authorUserId === clientUserId;
          const previousIndex =
            // ReverseInfiniteList starts counting back from Number.MAX_SAFE_INTEGER
            // since we don't know the total number of list items
            chatMessages.length - (Number.MAX_SAFE_INTEGER - index) - 1;
          const previousMessage = chatMessages[previousIndex];

          const isDateTransition =
            !previousMessage ||
            getCalendarDate(previousMessage.creationTimestamp) !==
              getCalendarDate(message.creationTimestamp);

          const isUserTransition =
            !previousMessage ||
            isDateTransition ||
            previousMessage.authorUserId !== message.authorUserId;

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
                  pb: "$3",
                  justifyContent: isClientMessage ? "flex-end" : "flex-start",
                }}
              >
                <ChatRoomMessage
                  message={message}
                  isClientMessage={isClientMessage}
                  isUserTransition={isGroupChat ? isUserTransition : undefined}
                  author={memberMap[message.authorUserId]}
                />
              </Flex>
            </Fragment>
          );
        }}
      />
    </Stack>
  );
};

const getCalendarDate = (timestamp: number) =>
  DateTime.fromMillis(timestamp).toLocaleString();
