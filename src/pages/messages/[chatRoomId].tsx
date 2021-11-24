import { useRouter } from "next/router";
import { ChatRoomContainer } from "#/templates/Messages/ChatRoom";

const ChatRoomPage = () => {
  const router = useRouter();
  const chatRoomId = router.query.chatRoomId as string;

  return <ChatRoomContainer chatRoomId={chatRoomId} />;
};

export default ChatRoomPage;
