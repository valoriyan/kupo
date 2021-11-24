import Link from "next/link";
import { RenderableChatRoom } from "#/api";
import { useGetChatRooms } from "#/api/queries/useGetChatRooms";

const ChatRoomListItem = ({ chatRoom }: { chatRoom: RenderableChatRoom }) => {
  const { chatRoomId, members } = chatRoom;

  console.log("members", members);

  const memberUsernames = members.map((member) => member.username);

  const chatRoomName = memberUsernames.join(", ");

  return (
    <Link href={`/messages/${chatRoomId}`}>
      <button>Enter Chat Room with {chatRoomName}</button>
    </Link>
  );
};

export const Messages = () => {
  const {
    data,
    isLoading,
    isFetching: isFetchingChatRooms,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    isError,
  } = useGetChatRooms({});

  console.log("hasNextPage", hasNextPage);

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
    return <ChatRoomListItem key={index} chatRoom={chatRoom} />;
  });

  return (
    <div>
      {isFetchingChatRooms ? (
        <div>
          Refreshing...
          <br />
        </div>
      ) : null}

      <h2>List of Chat Rooms:</h2>

      <br />
      <br />

      <Link href={`/messages/0`}>
        <button>Create New Room</button>
      </Link>

      <br />
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
          : "Nothing more to load"}
      </button>
    </div>
  );
};
