import { ProtectedPage } from "#/contexts/auth";
import { AddContent } from "#/templates/AddContent";

const AddContentPage = () => {
  return <AddContent />;
};

export default ProtectedPage(AddContentPage);
