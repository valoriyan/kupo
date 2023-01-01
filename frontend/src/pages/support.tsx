import Head from "next/head";
import { ReactElement } from "react";
import { Support } from "#/templates/Support";
import { AppLayout } from "#/components/AppLayout";

const SupportPage = () => {
  return (
    <>
      <Head>
        <title>Support / Kupo</title>
      </Head>
      <Support />
    </>
  );
};

SupportPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;

export default SupportPage;
