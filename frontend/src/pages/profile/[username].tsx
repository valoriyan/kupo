import { useRouter } from "next/router";
import { ReactElement } from "react";
import Head from "next/head";
import { AppLayout } from "#/components/AppLayout";
import { UserProfile } from "#/templates/UserProfile";

const ProfilePage = () => {
  const router = useRouter();
  const username = router.query.username as string;

  return (
    <>
      <Head>
        <title>@{username} / Kupo</title>
      </Head>
      <UserProfile username={username} />
    </>
  );
};

ProfilePage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;

export default ProfilePage;
