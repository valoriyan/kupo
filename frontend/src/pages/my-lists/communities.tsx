import Head from "next/head";
import { AppLayout } from "#/components/AppLayout";
import { StandardPageLayout } from "#/components/StandardPageLayout";
import { ProtectedPage } from "#/contexts/auth";
import { Communities } from "#/templates/MyLists/Communities";
import { getMyListsCloseHref } from ".";

const MyListsCommunitiesPage = ProtectedPage(() => {
  return (
    <>
      <Head>
        <title>Communities / Kupo</title>
      </Head>
      <Communities />
    </>
  );
});

MyListsCommunitiesPage.getLayout = (page) => (
  <AppLayout>
    <StandardPageLayout
      heading="My Lists - Communities"
      closeHref={getMyListsCloseHref()}
      backHref="/my-lists"
    >
      {page}
    </StandardPageLayout>
  </AppLayout>
);

export default MyListsCommunitiesPage;
