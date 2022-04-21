import { ReactElement } from "react";
import { NestedPageLayout } from "#/components/NestedPageLayout";
import { ProtectedPage } from "#/contexts/auth";
import { Followers } from "#/templates/MyLists/Followers";
import { getMyListsCloseHref } from ".";

const MyListsFollowersPage = ProtectedPage(() => {
  return <Followers />;
});

MyListsFollowersPage.getLayout = (page: ReactElement) => {
  return (
    <NestedPageLayout
      heading="My Lists - Followers"
      closeHref={getMyListsCloseHref()}
      backHref="/my-lists"
    >
      {page}
    </NestedPageLayout>
  );
};

export default MyListsFollowersPage;
