import { ChatRoom } from "./ChatRoom";
import { NewChatRoom } from "./NewChatRoom";

export interface ChatRoomContainerProps {
  chatRoomId: string;
}

export const ChatRoomContainer = ({ chatRoomId }: ChatRoomContainerProps) => {
  if (chatRoomId === "0") {
    return <NewChatRoom chatRoomId={chatRoomId} />;
  }

  return <ChatRoom chatRoomId={chatRoomId} />;
};
