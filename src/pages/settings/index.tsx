import Router from "next/router";
import { AppLayout } from "#/components/AppLayout";
import { NestedPageLayout } from "#/components/NestedPageLayout";
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
  return <Settings />;
});

SettingsPage.getLayout = (page) => {
  return (
    <AppLayout>
      <NestedPageLayout heading="Settings" closeHref={getSettingsCloseHref()}>
        {page}
      </NestedPageLayout>
    </AppLayout>
  );
};

export default SettingsPage;
