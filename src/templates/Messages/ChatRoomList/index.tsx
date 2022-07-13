import Link from "next/link";
import { UseInfiniteQueryResult } from "react-query";
import {
  RenderableUser,
  SecuredHTTPResponseGetPageOfChatRoomsFailedReasonGetPageOfChatRoomsSuccess,
} from "#/api";
import { styled } from "#/styling";
import { ChatRoomListItem } from "../ChatRoomListItem";

export const ChatRoomsList = ({
  clientUserData,
  infiniteQueryResultOfFetchingPageOfChatRooms,
}: {
  clientUserData: RenderableUser;
  infiniteQueryResultOfFetchingPageOfChatRooms: UseInfiniteQueryResult<
    SecuredHTTPResponseGetPageOfChatRoomsFailedReasonGetPageOfChatRoomsSuccess,
    Error
  >;
}) => {
  const {
    data,
    isLoading,
    isFetching: isFetchingChatRooms,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    isError,
  } = infiniteQueryResultOfFetchingPageOfChatRooms;

  if (isError && !isLoading) {
    return <div>Error: {(error as Error).message}</div>;
  }

  if (isLoading || !data) {
    return <div>Loading</div>;
  }

  const chatRooms = data.pages.flatMap((chatRoomDataPage) => {
    if (!chatRoomDataPage.success) return [];
    return chatRoomDataPage.success.chatRooms;
  });

  const renderedChatRooms = chatRooms.map((chatRoom, index) => {
    return (
      <ChatRoomListItem
        key={index}
        chatRoom={chatRoom}
        clientUserId={clientUserData.userId}
      />
    );
  });

  return (
    <div>
      {isFetchingChatRooms ? (
        <div>
          Refreshing...
          <br />
        </div>
      ) : null}

      <Link href={`/messages/new`} passHref>
        <CreateNewChatRoomButton>Create New Room</CreateNewChatRoomButton>
      </Link>
      <br />

      {renderedChatRooms}

      <button
        onClick={() => {
          fetchNextPage();
        }}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        <br />
        <br />

        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
          ? "Load More"
          : "No more chat rooms to load"}
      </button>
    </div>
  );
};

const CreateNewChatRoomButton = styled("a", {
  display: "inline-block",
  padding: "$2",
  bg: "$background3",
  color: "$text",
  margin: "$5",
  borderRadius: "$3",
  textDecoration: "none",
});
