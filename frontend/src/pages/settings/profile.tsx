import Head from "next/head";
import { useGetClientUserProfile } from "#/api/queries/users/useGetClientUserProfile";
import { AppLayout } from "#/components/AppLayout";
import { StandardPageLayout } from "#/components/StandardPageLayout";
import { ErrorArea } from "#/components/ErrorArea";
import { LoadingArea } from "#/components/LoadingArea";
import { ProtectedPage } from "#/contexts/auth";
import { Profile } from "#/templates/Settings/Profile";
import { getSettingsCloseHref } from ".";

const ProfileSettingsPage = ProtectedPage(() => {
  const { data, isLoading, error } = useGetClientUserProfile();

  return (
    <>
      <Head>
        <title>Edit Profile / Kupo</title>
      </Head>
      {!isLoading && error ? (
        <ErrorArea>{error.message || "An error occurred"}</ErrorArea>
      ) : isLoading || !data ? (
        <LoadingArea size="lg" />
      ) : (
        <Profile user={data} />
      )}
    </>
  );
});

ProfileSettingsPage.getLayout = (page) => {
  return (
    <AppLayout>
      <StandardPageLayout
        heading="Settings / Profile"
        closeHref={getSettingsCloseHref()}
        backHref="/settings"
      >
        {page}
      </StandardPageLayout>
    </AppLayout>
  );
};

export default ProfileSettingsPage;
