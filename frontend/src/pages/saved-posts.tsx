import Head from "next/head";
import { AppLayout } from "#/components/AppLayout";
import { ProtectedPage } from "#/contexts/auth";
import { SavedPosts } from "#/templates/SavedPosts";

const SavedPostsPage = ProtectedPage(() => {
  return (
    <>
      <Head>
        <title>Saved Posts / Kupo</title>
      </Head>
      <SavedPosts />
    </>
  );
});

SavedPostsPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default SavedPostsPage;
