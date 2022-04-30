import { AppLayout } from "#/components/AppLayout";
import { ProtectedPage } from "#/contexts/auth";
import { Feed } from "#/templates/Feed";

const FeedPage = ProtectedPage(() => {
  return <Feed />;
});

FeedPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default FeedPage;
