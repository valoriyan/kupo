import { useRouter } from "next/router";
import { ChatRoom } from "#/templates/Messages/ChatRoom";

const ChatRoomPage = () => {
  const router = useRouter();
  const chatRoomId = router.query.chatRoomId as string;

  return <ChatRoom chatRoomId={chatRoomId} />;
};

export default ChatRoomPage;
