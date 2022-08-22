import Head from "next/head";
import { AppLayout } from "#/components/AppLayout";
import { ProtectedPage } from "#/contexts/auth";
import { Notifications } from "#/templates/Notifications";

const NotificationsPage = ProtectedPage(() => {
  return (
    <>
      <Head>
        <title>Notifications / Kupo</title>
      </Head>
      <Notifications />
    </>
  );
});

NotificationsPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default NotificationsPage;
