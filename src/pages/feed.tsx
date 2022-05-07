import Head from "next/head";
import { AppLayout } from "#/components/AppLayout";
import { ProtectedPage } from "#/contexts/auth";
import { Feed } from "#/templates/Feed";

const FeedPage = ProtectedPage(() => {
  return (
    <>
      <Head>
        <title>Feed / Kupo</title>
      </Head>
      <Feed />
    </>
  );
});

FeedPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default FeedPage;
