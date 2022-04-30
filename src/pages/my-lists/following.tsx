import { AppLayout } from "#/components/AppLayout";
import { NestedPageLayout } from "#/components/NestedPageLayout";
import { ProtectedPage } from "#/contexts/auth";
import { Following } from "#/templates/MyLists/Following";
import { getMyListsCloseHref } from ".";

const MyListsFollowingPage = ProtectedPage(() => {
  return <Following />;
});

MyListsFollowingPage.getLayout = (page) => (
  <AppLayout>
    <NestedPageLayout
      heading="My Lists - Following"
      closeHref={getMyListsCloseHref()}
      backHref="/my-lists"
    >
      {page}
    </NestedPageLayout>
  </AppLayout>
);

export default MyListsFollowingPage;
