import Head from "next/head";
import { AppLayout } from "#/components/AppLayout";
import { StandardPageLayout } from "#/components/StandardPageLayout";
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
    <StandardPageLayout
      heading="My Lists - Follower Requests"
      closeHref={getMyListsCloseHref()}
      backHref="/my-lists"
    >
      {page}
    </StandardPageLayout>
  </AppLayout>
);

export default MyListsFollowerRequestsPage;
