import { ProtectedPage } from "#/contexts/auth";
import { UserProfile } from "#/templates/UserProfile";

const ProfilePage = () => {
  return <UserProfile isOwnProfile />;
};

export default ProtectedPage(ProfilePage);
