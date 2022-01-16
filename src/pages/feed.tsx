import { ProtectedPage } from "#/contexts/auth";
import { Feed } from "#/templates/Feed";

const FeedPage = () => {
  return <Feed />;
};

export default ProtectedPage(FeedPage);
