import { useRouter } from "next/router";
import Head from "next/head";
import { AppLayout } from "#/components/AppLayout";
import { NestedPageLayout } from "#/components/NestedPageLayout";
import { ProtectedPage } from "#/contexts/auth";
import { ChatRoom } from "#/templates/Messages/ChatRoom";
import { getMessagesCloseHref } from ".";

const ChatRoomPage = ProtectedPage(() => {
  const router = useRouter();
  const chatRoomId = router.query.chatRoomId as string;

  return (
    <>
      <Head>
        <title>Chat Room / Kupo</title>
      </Head>
      <ChatRoom chatRoomId={chatRoomId} />
    </>
  );
});

ChatRoomPage.getLayout = (page) => (
  <AppLayout>
    <NestedPageLayout
      heading="Messages"
      backHref="/messages"
      closeHref={getMessagesCloseHref()}
    >
      {page}
    </NestedPageLayout>
  </AppLayout>
);

export default ChatRoomPage;
