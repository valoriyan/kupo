import { AppLayout } from "#/components/AppLayout";
import { ProtectedPage } from "#/contexts/auth";
import { Discover } from "#/templates/Discover";

const DiscoverPage = ProtectedPage(() => {
  return <Discover />;
});

DiscoverPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default DiscoverPage;
