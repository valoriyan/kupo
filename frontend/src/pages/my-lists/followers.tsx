import Head from "next/head";
import { AppLayout } from "#/components/AppLayout";
import { StandardPageLayout } from "#/components/StandardPageLayout";
import { ProtectedPage } from "#/contexts/auth";
import { Followers } from "#/templates/MyLists/Followers";
import { getMyListsCloseHref } from ".";

const MyListsFollowersPage = ProtectedPage(() => {
  return (
    <>
      <Head>
        <title>Followers / Kupo</title>
      </Head>
      <Followers />
    </>
  );
});

MyListsFollowersPage.getLayout = (page) => (
  <AppLayout>
    <StandardPageLayout
      heading="My Lists - Followers"
      closeHref={getMyListsCloseHref()}
      backHref="/my-lists"
    >
      {page}
    </StandardPageLayout>
  </AppLayout>
);

export default MyListsFollowersPage;
