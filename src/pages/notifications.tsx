import { AppLayout } from "#/components/AppLayout";
import { ProtectedPage } from "#/contexts/auth";
import { Notifications } from "#/templates/Notifications";

const NotificationsPage = ProtectedPage(() => {
  return <Notifications />;
});

NotificationsPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default NotificationsPage;
