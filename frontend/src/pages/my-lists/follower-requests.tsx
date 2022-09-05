import Head from "next/head";
import { AppLayout } from "#/components/AppLayout";
import { NestedPageLayout } from "#/components/NestedPageLayout";
import { ProtectedPage } from "#/contexts/auth";
import { FollowerRequests } from "#/templates/MyLists/FollowerRequests";
import { getMyListsCloseHref } from ".";

const MyListsFollowerRequestsPage = ProtectedPage(() => {
  return (
    <>
      <Head>
        <title>Follower Requests / Kupo</title>
      </Head>
      <FollowerRequests />
    </>
  );
});

MyListsFollowerRequestsPage.getLayout = (page) => (
  <AppLayout>
    <NestedPageLayout
      heading="My Lists - Follower Requests"
      closeHref={getMyListsCloseHref()}
      backHref="/my-lists"
    >
      {page}
    </NestedPageLayout>
  </AppLayout>
);

export default MyListsFollowerRequestsPage;
