import Router from "next/router";
import { useCreateNewChatMessageInNewChatRoom } from "#/api/mutations/chat/createNewChatMessageInNewChatRoom";
import { FormStateProvider, useFormState } from "./FormContext";
import { NewMessageFormInput } from "./NewMessageFormInput";

const NewChatRoomInner = ({ userIds }: { userIds: string[] }) => {
  const { newChatMessage } = useFormState();

  const { mutateAsync: createNewChatMessageInNewChatRoom } =
    useCreateNewChatMessageInNewChatRoom();

  async function onSubmitNewChatMessage(event: React.FormEvent) {
    event.preventDefault();
    const newChatRoomId = await createNewChatMessageInNewChatRoom({
      userIds,
      chatMessageText: newChatMessage,
    });

    Router.push({
      pathname: `/messages/${newChatRoomId}`,
    });
  }

  return (
    <form onSubmit={onSubmitNewChatMessage}>
      <NewMessageFormInput />
    </form>
  );
};

export const NewChatRoom = ({ userIds }: { userIds: string[] }) => {
  return (
    <FormStateProvider>
      <NewChatRoomInner userIds={userIds} />
    </FormStateProvider>
  );
};
