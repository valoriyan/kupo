import { useGetPageOfChatRooms } from "#/api/queries/chat/useGetPageOfChatRooms";
import { styled } from "#/styling";
import { ChatRoomsListSearchBar } from "./ChatRoomsListSearchBar";
import { ChatRoomsListFilterBar } from "./ChatRoomsListFilterBar";
import { ChatRoomsList } from "./ChatRoomList";
import { useGetClientUserProfile } from "#/api/queries/users/useGetClientUserProfile";

export const Messages = () => {
  const infiniteQueryResultOfFetchingPageOfChatRooms = useGetPageOfChatRooms({});
  const { data, isLoading, error, isError } =
    infiniteQueryResultOfFetchingPageOfChatRooms;

  const {
    data: clientUserData,
    isError: isErrorAcquiringClientUserData,
    isLoading: isLoadingClientUserData,
  } = useGetClientUserProfile();

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
  gridTemplateRows: "auto auto 1fr",
  height: "100%",
  width: "100%",
});
