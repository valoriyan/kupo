import { FormStateProvider } from "./FormContext";
import { NewChatRoom } from "./NewChatRoom";

export interface ChatRoomProps {
  chatRoomId?: string;
}

export const ChatRoom = ({ chatRoomId }: ChatRoomProps) => {
  const contents =
    chatRoomId === "0" ? <NewChatRoom chatRoomId={chatRoomId} /> : <span>Chat Room</span>;

  return <FormStateProvider>{contents}</FormStateProvider>;
};
