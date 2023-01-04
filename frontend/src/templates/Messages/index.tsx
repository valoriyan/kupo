import { useState } from "react";
import { useGetPageOfChatRooms } from "#/api/queries/chat/useGetPageOfChatRooms";
import { BasicListWrapper } from "#/components/BasicList";
import { ErrorMessage } from "#/components/ErrorArea";
import { InfiniteList } from "#/components/InfiniteList";
import { LoadingArea } from "#/components/LoadingArea";
import { useCurrentUserId } from "#/contexts/auth";
import { ChatRoomListItem } from "./ChatRoomListItem";
import { ChatRoomsHeader } from "./ChatRoomsHeader";

export const Messages = () => {
  const [query, setQuery] = useState("");
  const { data, error, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPageOfChatRooms({ query });
  const clientUserId = useCurrentUserId();

  const chatRooms = data?.pages.flatMap((page) => page.chatRooms);

  return (
    <BasicListWrapper>
      <ChatRoomsHeader query={query} setQuery={setQuery} />
      <div>
        {error && !isLoading ? (
          <ErrorMessage>{error.message || "An error occurred"}</ErrorMessage>
        ) : isLoading || !chatRooms || !clientUserId ? (
          <LoadingArea size="lg" />
        ) : !chatRooms.length ? (
          <ErrorMessage>
            {query ? "No matching chats found" : "You don't have any messages yet"}
          </ErrorMessage>
        ) : (
          <InfiniteList
            hasNextPage={hasNextPage ?? false}
            isNextPageLoading={isFetchingNextPage}
            loadNextPage={fetchNextPage}
            data={chatRooms}
            renderItem={(index, chatRoom) => (
              <ChatRoomListItem
                key={chatRoom.chatRoomId}
                hasUnreadMessages={chatRoom.hasUnreadMessages}
                chatRoom={chatRoom}
                clientUserId={clientUserId}
              />
            )}
          />
        )}
      </div>
    </BasicListWrapper>
  );
};
