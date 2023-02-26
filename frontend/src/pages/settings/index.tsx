import Head from "next/head";
import Router from "next/router";
import { AppLayout } from "#/components/AppLayout";
import { StandardPageLayout } from "#/components/StandardPageLayout";
import { ProtectedPage } from "#/contexts/auth";
import { Settings } from "#/templates/Settings";
import { SessionStorageItem } from "#/utils/storage";

const previousLocation = SessionStorageItem<string>("settings");

export const setPreviousLocationForSettings = () => {
  if (Router.asPath.includes("/settings")) return;
  previousLocation.set(Router.asPath);
};

export const getSettingsCloseHref = () => previousLocation.get() ?? "/feed";

const SettingsPage = ProtectedPage(() => {
  return (
    <>
      <Head>
        <title>Settings / Kupo</title>
      </Head>
      <Settings />
    </>
  );
});

SettingsPage.getLayout = (page) => {
  return (
    <AppLayout>
      <StandardPageLayout heading="Settings" closeHref={getSettingsCloseHref()}>
        {page}
      </StandardPageLayout>
    </AppLayout>
  );
};

export default SettingsPage;
