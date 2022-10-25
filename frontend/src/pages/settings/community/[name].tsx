import Head from "next/head";
import { useRouter } from "next/router";
import { useGetCommunityByName } from "#/api/queries/community/useGetCommunityByName";
import { AppLayout } from "#/components/AppLayout";
import { ErrorArea } from "#/components/ErrorArea";
import { LoadingArea } from "#/components/LoadingArea";
import { NestedPageLayout } from "#/components/NestedPageLayout";
import { ProtectedPage, useCurrentUserId } from "#/contexts/auth";
import { Community } from "#/templates/Settings/Community";
import { getSettingsCloseHref } from "..";

const CommunitySettingsPage = ProtectedPage(() => {
  const router = useRouter();
  const name = router.query.name as string;
  const clientUserId = useCurrentUserId();
  const { data, isLoading, error } = useGetCommunityByName({ name });
  const isOwner = data && clientUserId && data.ownerUserId === clientUserId;

  return (
    <>
      <Head>
        <title>Edit +{name} / Kupo</title>
      </Head>
      {!isLoading && error ? (
        <ErrorArea>{error.message || "An error occurred"}</ErrorArea>
      ) : isLoading || !data || !clientUserId ? (
        <LoadingArea size="lg" />
      ) : !isOwner ? (
        <ErrorArea>You can&apos;t edit this community</ErrorArea>
      ) : (
        <Community community={data} />
      )}
    </>
  );
});

CommunitySettingsPage.getLayout = (page) => {
  return (
    <AppLayout>
      <NestedPageLayout
        heading={<PageHeading />}
        closeHref={getSettingsCloseHref()}
        backHref="/settings"
      >
        {page}
      </NestedPageLayout>
    </AppLayout>
  );
};

const PageHeading = () => {
  const router = useRouter();
  const communityName = router.query.name as string;

  return <>{`Settings / +${communityName}`}</>;
};

export default CommunitySettingsPage;
