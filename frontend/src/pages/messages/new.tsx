import Head from "next/head";
import { AppLayout } from "#/components/AppLayout";
import { NestedPageLayout } from "#/components/NestedPageLayout";
import { ProtectedPage } from "#/contexts/auth";
import { NewChatRoom } from "#/templates/Messages/CreateChatRoom";
import { getMessagesCloseHref } from ".";

const CreateChatRoomPage = ProtectedPage(() => {
  return (
    <>
      <Head>
        <title>New Chat Room / Kupo</title>
      </Head>
      <NewChatRoom />
    </>
  );
});

CreateChatRoomPage.getLayout = (page) => (
  <AppLayout>
    <NestedPageLayout
      heading="New Message"
      backHref="/messages"
      closeHref={getMessagesCloseHref()}
      handleScroll={false}
    >
      {page}
    </NestedPageLayout>
  </AppLayout>
);

export default CreateChatRoomPage;
