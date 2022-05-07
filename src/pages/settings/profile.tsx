import { AppLayout } from "#/components/AppLayout";
import { NestedPageLayout } from "#/components/NestedPageLayout";
import { getSettingsCloseHref } from ".";
import EditProfile from "../edit-profile";

const ProfileSettingsPage = EditProfile;

ProfileSettingsPage.getLayout = (page) => {
  return (
    <AppLayout>
      <NestedPageLayout
        heading="Settings - Profile"
        closeHref={getSettingsCloseHref()}
        backHref="/settings"
      >
        {page}
      </NestedPageLayout>
    </AppLayout>
  );
};

export default ProfileSettingsPage;
