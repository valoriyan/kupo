import Head from "next/head";
import { AppLayout } from "#/components/AppLayout";
import { ProtectedPage } from "#/contexts/auth";
import { AddContent } from "#/templates/AddContent";

const AddContentPage = ProtectedPage(() => {
  return (
    <>
      <Head>
        <title>Add Content / Kupo</title>
      </Head>
      <AddContent />
    </>
  );
});

AddContentPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default AddContentPage;
