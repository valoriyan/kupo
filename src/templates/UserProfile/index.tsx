import { useGetUserProfile } from "#/api/queries/useGetUserProfile";
import { AppLayout } from "#/components/AppLayout";
import { LoadingArea } from "#/components/LoadingArea";

export interface UserProfileProps {
  isOwnProfile?: boolean;
  username?: string;
}

export const UserProfile = ({ isOwnProfile, username }: UserProfileProps) => {
  const { data, isLoading } = useGetUserProfile({ username, isOwnProfile });

  return (
    <AppLayout>
      {isLoading || !data ? <LoadingArea size="large" /> : data?.success?.username}
    </AppLayout>
  );
};
