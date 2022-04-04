import { useRouter } from "next/router";
import { ReactElement } from "react";
import { NestedPageLayout } from "#/components/NestedPageLayout";
import { ProtectedPage } from "#/contexts/auth";
import { ChatRoom } from "#/templates/Messages/ChatRoom";
import { getMessagesCloseHref } from ".";

const ChatRoomPage = ProtectedPage(() => {
  const router = useRouter();
  const chatRoomId = router.query.chatRoomId as string;

  return <ChatRoom chatRoomId={chatRoomId} />;
});

ChatRoomPage.getLayout = (page: ReactElement) => {
  return (
    <NestedPageLayout
      heading="Messages"
      backHref="/messages"
      closeHref={getMessagesCloseHref()}
    >
      {page}
    </NestedPageLayout>
  );
};

export default ChatRoomPage;
