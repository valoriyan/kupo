import { useRouter } from "next/router";
import { ReactElement } from "react";
import Head from "next/head";
import { AppLayout } from "#/components/AppLayout";
import { CommunityPage } from "#/templates/CommunityPage";

const CommunityPagePage = () => {
  const router = useRouter();
  const name = router.query.name as string;

  return (
    <>
      <Head>
        <title>+{name} / Kupo</title>
      </Head>
      <CommunityPage name={name} />
    </>
  );
};

CommunityPagePage.getLayout = (page: ReactElement) => (
  <AppLayout trackContentScroll>{page}</AppLayout>
);

export default CommunityPagePage;
