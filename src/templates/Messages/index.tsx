import { useState } from "react";
import { useGetPageOfChatRooms } from "#/api/queries/chat/useGetPageOfChatRooms";
import { ErrorMessage } from "#/components/ErrorArea";
import { InfiniteScrollArea } from "#/components/InfiniteScrollArea";
import { LoadingArea } from "#/components/LoadingArea";
import { useCurrentUserId } from "#/contexts/auth";
import { styled } from "#/styling";
import { ChatRoomListItem } from "./ChatRoomListItem";
import { ChatRoomsHeader } from "./ChatRoomsHeader";

export const Messages = () => {
  const [query, setQuery] = useState("");
  const { data, error, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPageOfChatRooms({ query });
  const clientUserId = useCurrentUserId();

  const chatRooms = data?.pages.flatMap((page) => page.chatRooms);

  return (
    <Wrapper>
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
          <InfiniteScrollArea
            hasNextPage={hasNextPage ?? false}
            isNextPageLoading={isFetchingNextPage}
            loadNextPage={fetchNextPage}
            items={chatRooms.map((chatRoom) => (
              <ChatRoomListItem
                key={chatRoom.chatRoomId}
                chatRoom={chatRoom}
                clientUserId={clientUserId}
              />
            ))}
          />
        )}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  display: "grid",
  gridTemplateRows: "auto minmax(0, 1fr)",
  size: "100%",
});
