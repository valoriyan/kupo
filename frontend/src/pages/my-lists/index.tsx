import Head from "next/head";
import Router from "next/router";
import { AppLayout } from "#/components/AppLayout";
import { StandardPageLayout } from "#/components/StandardPageLayout";
import { ProtectedPage } from "#/contexts/auth";
import { MyLists } from "#/templates/MyLists";
import { SessionStorageItem } from "#/utils/storage";

const previousLocation = SessionStorageItem<string>("my-lists");

export const setPreviousLocationForMyLists = () => {
  if (Router.asPath.includes("/my-lists")) return;
  previousLocation.set(Router.asPath);
};

export const getMyListsCloseHref = () => previousLocation.get() ?? "/feed";

const MyListsPage = ProtectedPage(() => {
  return (
    <>
      <Head>
        <title>My Lists / Kupo</title>
      </Head>
      <MyLists />
    </>
  );
});

MyListsPage.getLayout = (page) => (
  <AppLayout>
    <StandardPageLayout heading="My Lists" closeHref={getMyListsCloseHref()}>
      {page}
    </StandardPageLayout>
  </AppLayout>
);

export default MyListsPage;
