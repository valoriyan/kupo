import { ProtectedPage } from "#/contexts/auth";
import { Home } from "#/templates/Home";

const HomePage = () => {
  return <Home />;
};

export default ProtectedPage(HomePage);
