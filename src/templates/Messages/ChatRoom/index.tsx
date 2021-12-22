import { ChatRoom } from "./ChatRoom";
import { NewChatRoom } from "./NewChatRoom";

export interface ChatRoomContainerProps {
  chatRoomId: string;
}

export const ChatRoomContainer = ({ chatRoomId }: ChatRoomContainerProps) => {
  if (chatRoomId === "new") {
    return <NewChatRoom />;
  }

  return <ChatRoom chatRoomId={chatRoomId} />;
};
