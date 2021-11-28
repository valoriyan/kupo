import { ProtectedPage } from "#/contexts/auth";
import { Messages } from "#/templates/Messages";

const MessagesPage = () => {
  return <Messages />;
};

export default ProtectedPage(MessagesPage);
