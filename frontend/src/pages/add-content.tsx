import Head from "next/head";
import { useRouter } from "next/router";
import { AppLayout } from "#/components/AppLayout";
import { ProtectedPage } from "#/contexts/auth";
import { AddContent } from "#/templates/AddContent";

const AddContentPage = ProtectedPage(() => {
  const publishingChannelId = useRouter().query.publishingChannelId as string | undefined;

  return (
    <>
      <Head>
        <title>Add Content / Kupo</title>
      </Head>
      <AddContent publishingChannelId={publishingChannelId} />
    </>
  );
});

AddContentPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default AddContentPage;
