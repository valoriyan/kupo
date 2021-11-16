import { useGetUserProfile } from "#/api/queries/useGetUserProfile";
import { useGetChatRooms } from "#/api/queries/useGetChatRooms";

export const Messages = () => {
  const { data, isLoading } = useGetUserProfile({ isOwnProfile: true });
  const {
    data: chatRoomData,
    isLoading: isLoadingChatRoomData,
    isFetching: isFetchingChatRooms,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetChatRooms({});

  if (isLoading || isLoadingChatRoomData) {
    return <div>Loading</div>;
  }

  if (!data || !data.success || !chatRoomData) {
    return <div>Error: {data?.error}</div>;
  }

  const chatRooms = chatRoomData.pages
    .filter((chatRoomDataPage) => !!chatRoomDataPage.success)
    .flatMap((chatRoomDataPage) => {
      return chatRoomDataPage.success!.chatRooms;
    });

  const renderedChatRooms = chatRooms.map((chatRoom, index) => {
    console.log("HIT!", chatRoom);
    return <div key={index}>Chat Room: {chatRoom.chatRoomId}</div>;
  });

  // const nextChatPageCursor = (chatRoomData.pages.at(-1) && chatRoomData.pages.at(-1)?.success) ? chatRoomData.pages.at(-1)?.success?.nextPageCursor : undefined;

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
