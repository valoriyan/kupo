import { AppLayout } from "#/components/AppLayout";
import { NestedPageLayout } from "#/components/NestedPageLayout";
import { ProtectedPage } from "#/contexts/auth";
import { Followers } from "#/templates/MyLists/Followers";
import { getMyListsCloseHref } from ".";

const MyListsFollowersPage = ProtectedPage(() => {
  return <Followers />;
});

MyListsFollowersPage.getLayout = (page) => (
  <AppLayout>
    <NestedPageLayout
      heading="My Lists - Followers"
      closeHref={getMyListsCloseHref()}
      backHref="/my-lists"
    >
      {page}
    </NestedPageLayout>
  </AppLayout>
);

export default MyListsFollowersPage;
