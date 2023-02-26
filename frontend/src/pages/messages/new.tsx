import Head from "next/head";
import { useRouter } from "next/router";
import { AppLayout } from "#/components/AppLayout";
import { StandardPageLayout } from "#/components/StandardPageLayout";
import { ProtectedPage } from "#/contexts/auth";
import { NewChatRoom } from "#/templates/Messages/CreateChatRoom";
import { getMessagesCloseHref } from ".";

const CreateChatRoomPage = ProtectedPage(() => {
  const router = useRouter();
  const { username } = router.query;
  const initialUsernames = username
    ? Array.isArray(username)
      ? username
      : [username]
    : [];

  return (
    <>
      <Head>
        <title>New Chat Room / Kupo</title>
      </Head>
      <NewChatRoom initialUsernames={initialUsernames} />
    </>
  );
});

CreateChatRoomPage.getLayout = (page) => (
  <AppLayout>
    <StandardPageLayout
      heading="New Message"
      backHref="/messages"
      closeHref={getMessagesCloseHref()}
    >
      {page}
    </StandardPageLayout>
  </AppLayout>
);

export default CreateChatRoomPage;
