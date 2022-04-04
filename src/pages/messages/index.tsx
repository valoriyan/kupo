import Router from "next/router";
import { ReactElement } from "react";
import { NestedPageLayout } from "#/components/NestedPageLayout";
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
  return <Messages />;
});

MessagesPage.getLayout = (page: ReactElement) => {
  return (
    <NestedPageLayout heading="Messages" closeHref={getMessagesCloseHref()}>
      {page}
    </NestedPageLayout>
  );
};

export default MessagesPage;
