import { ProtectedPage } from "#/contexts/auth";
import { Settings } from "#/templates/Settings";

const SettingsPage = () => {
  return <Settings />;
};

export default ProtectedPage(SettingsPage);
