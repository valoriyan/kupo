import Head from "next/head";
import { useGetClientUserProfile } from "#/api/queries/users/useGetClientUserProfile";
import { AppLayout } from "#/components/AppLayout";
import { ErrorArea } from "#/components/ErrorArea";
import { LoadingArea } from "#/components/LoadingArea";
import { NestedPageLayout } from "#/components/NestedPageLayout";
import { ProtectedPage } from "#/contexts/auth";
import { EditProfile } from "#/templates/EditProfile";
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
        <EditProfile user={data} />
      )}
    </>
  );
});

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
