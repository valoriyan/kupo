import { useGetUserProfile } from "#/api/queries/users/useGetUserProfile";
import { ErrorArea } from "#/components/ErrorArea";
import { LoadingArea } from "#/components/LoadingArea";
import { ProtectedPage } from "#/contexts/auth";
import { EditProfile } from "#/templates/EditProfile";

const EditProfilePage = () => {
  const { data, isLoading, error } = useGetUserProfile({ isOwnProfile: true });

  return !isLoading && error ? (
    <ErrorArea>{error.message || "An Unexpected Error Occurred"}</ErrorArea>
  ) : isLoading || !data ? (
    <LoadingArea size="lg" />
  ) : (
    <EditProfile user={data} />
  );
};

export default ProtectedPage(EditProfilePage);
