import { ReactElement } from "react";
import Router from "next/router";
import { NestedPageLayout } from "#/components/NestedPageLayout";
import { Settings } from "#/templates/Settings";
import { SessionStorageItem } from "#/utils/storage";
import { ProtectedPage } from "#/contexts/auth";

const previousLocation = SessionStorageItem<string>("settings");

export const setPreviousLocationForSettings = () => {
  if (Router.asPath.includes("/settings")) return;
  previousLocation.set(Router.asPath);
};

export const getSettingsCloseHref = () => previousLocation.get() ?? "/feed";

const SettingsPage = ProtectedPage(() => {
  return <Settings />;
});

SettingsPage.getLayout = (page: ReactElement) => {
  return (
    <NestedPageLayout heading="Settings" closeHref={getSettingsCloseHref()}>
      {page}
    </NestedPageLayout>
  );
};

export default SettingsPage;
