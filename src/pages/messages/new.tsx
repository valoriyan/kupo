import { useRouter } from "next/router";
import { ReactElement } from "react";
import { NestedPageLayout } from "#/components/NestedPageLayout";
import { ProtectedPage } from "#/contexts/auth";
import { NewChatRoom } from "#/templates/Messages/CreateChatRoom";
import { getMessagesCloseHref } from ".";

const CreateChatRoomPage = ProtectedPage(() => {
  const router = useRouter();
  const userIds = router.query.userIds as string[];

  return <NewChatRoom userIds={userIds} />;
});

CreateChatRoomPage.getLayout = (page: ReactElement) => {
  return (
    <NestedPageLayout
      heading="New Message"
      backHref="/messages"
      closeHref={getMessagesCloseHref()}
    >
      {page}
    </NestedPageLayout>
  );
};

export default CreateChatRoomPage;
