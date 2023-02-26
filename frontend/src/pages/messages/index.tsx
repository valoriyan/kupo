import Head from "next/head";
import Router from "next/router";
import { AppLayout } from "#/components/AppLayout";
import { StandardPageLayout } from "#/components/StandardPageLayout";
import { ProtectedPage } from "#/contexts/auth";
import { Messages } from "#/templates/Messages";
import { SessionStorageItem } from "#/utils/storage";

const previousLocation = SessionStorageItem<string>("messages");

export const setPreviousLocationForMessages = () => {
  if (Router.asPath.includes("/messages")) return;
  previousLocation.set(Router.asPath);
};

export const getMessagesCloseHref = () => previousLocation.get() ?? "/feed";

const MessagesPage = ProtectedPage(() => {
  return (
    <>
      <Head>
        <title>Messages / Kupo</title>
      </Head>
      <Messages />
    </>
  );
});

MessagesPage.getLayout = (page) => (
  <AppLayout>
    <StandardPageLayout heading="Messages" closeHref={getMessagesCloseHref()}>
      {page}
    </StandardPageLayout>
  </AppLayout>
);

export default MessagesPage;
