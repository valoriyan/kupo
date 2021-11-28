import { ChatRoom } from "./ChatRoom";
import { CreateNewChatRoom } from "./CreateNewChatRoom";

export interface ChatRoomContainerProps {
  chatRoomId: string;
}

export const ChatRoomContainer = ({ chatRoomId }: ChatRoomContainerProps) => {
  if (chatRoomId === "0") {
    return <CreateNewChatRoom />;
  }

  return <ChatRoom chatRoomId={chatRoomId} />;
};
