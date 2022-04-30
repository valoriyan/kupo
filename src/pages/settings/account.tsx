import { AppLayout } from "#/components/AppLayout";
import { NestedPageLayout } from "#/components/NestedPageLayout";
import { ProtectedPage } from "#/contexts/auth";
import { Account } from "#/templates/Settings/Account";
import { getSettingsCloseHref } from ".";

const AccountSettingsPage = ProtectedPage(() => {
  return <Account />;
});

AccountSettingsPage.getLayout = (page) => {
  return (
    <AppLayout>
      <NestedPageLayout
        heading="Settings - Account"
        closeHref={getSettingsCloseHref()}
        backHref="/settings"
      >
        {page}
      </NestedPageLayout>
    </AppLayout>
  );
};

export default AccountSettingsPage;
