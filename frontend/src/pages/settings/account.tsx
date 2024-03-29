import Head from "next/head";
import { AppLayout } from "#/components/AppLayout";
import { StandardPageLayout } from "#/components/StandardPageLayout";
import { ProtectedPage } from "#/contexts/auth";
import { Account } from "#/templates/Settings/Account";
import { getSettingsCloseHref } from ".";

const AccountSettingsPage = ProtectedPage(() => {
  return (
    <>
      <Head>
        <title>Account Settings / Kupo</title>
      </Head>
      <Account />
    </>
  );
});

AccountSettingsPage.getLayout = (page) => {
  return (
    <AppLayout>
      <StandardPageLayout
        heading="Settings / Account"
        closeHref={getSettingsCloseHref()}
        backHref="/settings"
      >
        {page}
      </StandardPageLayout>
    </AppLayout>
  );
};

export default AccountSettingsPage;
