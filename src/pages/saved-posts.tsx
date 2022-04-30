import { AppLayout } from "#/components/AppLayout";
import { ProtectedPage } from "#/contexts/auth";
import { SavedPosts } from "#/templates/SavedPosts";

const SavedPostsPage = ProtectedPage(() => {
  return <SavedPosts />;
});

SavedPostsPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default SavedPostsPage;
