import { Api, RenderableChatRoom } from "#/api";
import { useGetUserProfile } from "#/api/queries/useGetUserProfile";
import { useState } from "react";

export const Messages = () => {
  const [chatRooms, setChatRooms] = useState<RenderableChatRoom[]>([]);

  const { data, isLoading } = useGetUserProfile({ isOwnProfile: true });
  const [hasLoaded, updatedHasLoaded] = useState<boolean>(false);

  if (isLoading) {
    return <div>Loading</div>;
  }
  
  if (!data || !!data.error) {
    return <div>Error: {data?.error}</div>;
  }


  if (!hasLoaded) {
    updatedHasLoaded(true);
    Api.getPageOfChatRooms({pageSize: 5}).then(({data: pageOfchatRoomsResponse}) => {
      if (pageOfchatRoomsResponse.success) {
        setChatRooms(pageOfchatRoomsResponse.success.chatRooms);
      }
    });
  }


  const renderedChatRooms = chatRooms.map((chatRoom, index) => {
    return (
      <div key={index}>
        Chat Room
      </div>
    )
  })

  return (
    <div>
      Messages

      {renderedChatRooms}
    </div>
  )
}