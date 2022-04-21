import { ReactElement } from "react";
import Router from "next/router";
import { NestedPageLayout } from "#/components/NestedPageLayout";
import { MyLists } from "#/templates/MyLists";
import { SessionStorageItem } from "#/utils/storage";
import { ProtectedPage } from "#/contexts/auth";

const previousLocation = SessionStorageItem<string>("my-lists");

export const setPreviousLocationForMyLists = () => {
  if (Router.asPath.includes("/my-lists")) return;
  previousLocation.set(Router.asPath);
};

export const getMyListsCloseHref = () => previousLocation.get() ?? "/feed";

const MyListsPage = ProtectedPage(() => {
  return <MyLists />;
});

MyListsPage.getLayout = (page: ReactElement) => {
  return (
    <NestedPageLayout heading="My Lists" closeHref={getMyListsCloseHref()}>
      {page}
    </NestedPageLayout>
  );
};

export default MyListsPage;
