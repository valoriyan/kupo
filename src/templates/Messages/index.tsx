import { useGetUserProfile } from "#/api/queries/useGetUserProfile";
import { useGetChatRooms } from "#/api/queries/useGetChatRooms";

export const Messages = () => {
  const { data, isLoading } = useGetUserProfile({ isOwnProfile: true });
  const { data: chatRoomData, isLoading: isLoadingChatRoomData } = useGetChatRooms();

  if (isLoading || isLoadingChatRoomData) {
    return <div>Loading</div>;
  }

  if (!data || !data.success || !chatRoomData || !chatRoomData.success) {
    return <div>Error: {data?.error}</div>;
  }

  const chatRooms = chatRoomData.success.chatRooms;

  const renderedChatRooms = chatRooms.map((chatRoom, index) => {
    return <div key={index}>Chat Room: {chatRoom.chatRoomId}</div>;
  });

  return (
    <div>
      Messages
      {renderedChatRooms}
    </div>
  );
};
