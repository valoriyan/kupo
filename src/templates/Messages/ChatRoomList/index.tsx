import Link from "next/link";
import { UseInfiniteQueryResult } from "react-query";
import {
  RenderableUser,
  SecuredHTTPResponseFailedtoGetPageOfChatRoomsResponseSuccessfulGetPageOfChatRoomsResponse,
} from "#/api";
import { styled } from "#/styling";
import { ChatRoomListItem } from "./ChatRoomListItem";

export const ChatRoomsList = ({
  clientUserData,
  infiniteQueryResultOfFetchingPageOfChatRooms,
}: {
  clientUserData: RenderableUser;
  infiniteQueryResultOfFetchingPageOfChatRooms: UseInfiniteQueryResult<
    SecuredHTTPResponseFailedtoGetPageOfChatRoomsResponseSuccessfulGetPageOfChatRoomsResponse,
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

  const chatRooms = data.pages
    .filter((chatRoomDataPage) => !!chatRoomDataPage.success)
    .flatMap((chatRoomDataPage) => {
      return chatRoomDataPage.success!.chatRooms;
    });

  const renderedChatRooms = chatRooms.map((chatRoom, index) => {
    return (
      <ChatRoomListItem key={index} chatRoom={chatRoom} clientUserData={clientUserData} />
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

      <Link href={`/messages/new`}>
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
          : "Nothing more chat rooms to load"}
      </button>
    </div>
  );
};

const CreateNewChatRoomButton = styled("button", {
  padding: "$2",
  backgroundColor: "$background3",
  margin: "$5",
  borderRadius: "$3",
});
