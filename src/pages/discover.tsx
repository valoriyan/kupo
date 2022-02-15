import { ProtectedPage } from "#/contexts/auth";
import { Discover } from "#/templates/Discover";

const DiscoverPage = () => {
  return <Discover />;
};

export default ProtectedPage(DiscoverPage);
