import { ProtectedPage } from "#/contexts/auth";
import { Notifications } from "#/templates/Notifications";

const NotificationsPage = () => {
  return <Notifications />;
};

export default ProtectedPage(NotificationsPage);
