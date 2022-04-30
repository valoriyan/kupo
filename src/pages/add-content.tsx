import { AppLayout } from "#/components/AppLayout";
import { ProtectedPage } from "#/contexts/auth";
import { AddContent } from "#/templates/AddContent";

const AddContentPage = ProtectedPage(() => {
  return <AddContent />;
});

AddContentPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default AddContentPage;
