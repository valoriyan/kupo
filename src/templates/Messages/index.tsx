import { useGetChatRooms } from "#/api/queries/useGetChatRooms";

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
    return <div key={index}>Chat Room: {chatRoom.chatRoomId}</div>;
  });

  return (
    <div>
      {isFetchingChatRooms ? <div>Refreshing...</div> : null}
      List of Chat Rooms:
      {renderedChatRooms}
      <button
        onClick={() => {
          fetchNextPage();
        }}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
          ? "Load More"
          : "Nothing more to load"}
      </button>
    </div>
  );
};
