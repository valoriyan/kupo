import Head from "next/head";
import { useRouter } from "next/router";
import { AppLayout } from "#/components/AppLayout";
import { StandardPageLayout } from "#/components/StandardPageLayout";
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
      {chatRoomId ? <ChatRoom chatRoomId={chatRoomId} /> : null}
    </>
  );
});

ChatRoomPage.getLayout = (page) => (
  <AppLayout>
    <StandardPageLayout
      heading="Messages"
      backHref="/messages"
      closeHref={getMessagesCloseHref()}
    >
      {page}
    </StandardPageLayout>
  </AppLayout>
);

export default ChatRoomPage;
