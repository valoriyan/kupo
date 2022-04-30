import { useRouter } from "next/router";
import { ReactElement } from "react";
import { AppLayout } from "#/components/AppLayout";
import { UserProfile } from "#/templates/UserProfile";

const ProfilePage = () => {
  const router = useRouter();
  const username = router.query.username as string;

  return <UserProfile username={username} />;
};

ProfilePage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;

export default ProfilePage;
