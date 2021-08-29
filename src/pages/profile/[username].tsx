import { useRouter } from "next/router";
import { UserProfile } from "#/templates/UserProfile";

const ProfilePage = () => {
  const router = useRouter();
  const username = router.query.username as string;

  return <UserProfile username={username} />;
};

export default ProfilePage;
