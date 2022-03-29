import { ReactElement } from "react";
import { NestedPageLayout } from "#/components/NestedPageLayout";
import { Following } from "#/templates/MyLists/Following";
import { getMyListsCloseHref } from ".";
import { ProtectedPage } from "#/contexts/auth";

const MyListsFollowingPage = ProtectedPage(() => {
  return <Following />;
});

MyListsFollowingPage.getLayout = (page: ReactElement) => {
  return (
    <NestedPageLayout
      heading="My Lists - Following"
      closeHref={getMyListsCloseHref()}
      backHref="/my-lists"
    >
      {page}
    </NestedPageLayout>
  );
};

export default MyListsFollowingPage;
