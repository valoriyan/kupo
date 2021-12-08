import { useGetPageOfChatRooms } from "#/api/queries/chat/useGetPageOfChatRooms";
import { styled } from "#/styling";
import { ChatRoomsListSearchBar } from "./ChatRoomsListSearchBar";
import { ChatRoomsListFilterBar } from "./ChatRoomsListFilterBar";
import { ChatRoomsList } from "./ChatRoomList";
import { useGetUserProfile } from "#/api/queries/users/useGetUserProfile";

export const Messages = () => {
  const infiniteQueryResultOfFetchingPageOfChatRooms = useGetPageOfChatRooms({});
  const { data, isLoading, error, isError } =
    infiniteQueryResultOfFetchingPageOfChatRooms;

  const {
    data: clientUserData,
    isError: isErrorAcquiringClientUserData,
    isLoading: isLoadingClientUserData,
  } = useGetUserProfile({ isOwnProfile: true });

  if (
    (isError && !isLoading) ||
    (isErrorAcquiringClientUserData && !isLoadingClientUserData)
  ) {
    return <div>Error: {(error as Error).message}</div>;
  }

  if (isLoading || !data || isLoadingClientUserData || !clientUserData) {
    return <div>Loading</div>;
  }

  return (
    <Grid>
      <ChatRoomsListSearchBar />
      <ChatRoomsListFilterBar />
      <ChatRoomsList
        clientUserData={clientUserData}
        infiniteQueryResultOfFetchingPageOfChatRooms={
          infiniteQueryResultOfFetchingPageOfChatRooms
        }
      />
    </Grid>
  );
};

const Grid = styled("div", {
  display: "grid",
  gridTemplateRows: "5% 5% 90%",
  height: "100%",
  width: "100%",
});
