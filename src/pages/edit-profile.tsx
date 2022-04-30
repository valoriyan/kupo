import { useGetClientUserProfile } from "#/api/queries/users/useGetClientUserProfile";
import { AppLayout } from "#/components/AppLayout";
import { ErrorArea } from "#/components/ErrorArea";
import { LoadingArea } from "#/components/LoadingArea";
import { ProtectedPage } from "#/contexts/auth";
import { EditProfile } from "#/templates/EditProfile";

const EditProfilePage = ProtectedPage(() => {
  const { data, isLoading, error } = useGetClientUserProfile();

  return !isLoading && error ? (
    <ErrorArea>{error.message || "An error occurred"}</ErrorArea>
  ) : isLoading || !data ? (
    <LoadingArea size="lg" />
  ) : (
    <EditProfile user={data} />
  );
});

EditProfilePage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default EditProfilePage;
