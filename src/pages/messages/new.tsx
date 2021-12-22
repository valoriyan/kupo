import { useRouter } from "next/router";
import { ProtectedPage } from "#/contexts/auth";
import { NewChatRoom } from "#/templates/Messages/ChatRoom/NewChatRoom";

const NewChatRoomPage = () => {
  const router = useRouter();
  const { userIds } = router.query;

  return (
    <div>
      <NewChatRoom userIds={userIds as string[]} />
    </div>
  );
};

export default ProtectedPage(NewChatRoomPage);
