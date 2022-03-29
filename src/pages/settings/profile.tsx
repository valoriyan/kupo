import { ReactElement } from "react";
import { NestedPageLayout } from "#/components/NestedPageLayout";
import { getSettingsCloseHref } from ".";
import EditProfile from "../edit-profile";

const ProfileSettingsPage = EditProfile;

ProfileSettingsPage.getLayout = (page: ReactElement) => {
  return (
    <NestedPageLayout
      heading="Settings - Profile"
      closeHref={getSettingsCloseHref()}
      backHref="/settings"
    >
      {page}
    </NestedPageLayout>
  );
};

export default ProfileSettingsPage;
