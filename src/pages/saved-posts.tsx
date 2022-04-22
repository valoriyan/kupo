import { ProtectedPage } from "#/contexts/auth";
import { SavedPosts } from "#/templates/SavedPosts";

const SavedPostsPage = () => {
  return <SavedPosts />;
};

export default ProtectedPage(SavedPostsPage);
