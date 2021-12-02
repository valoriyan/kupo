import Router from "next/router";
import { useCreateNewChatMessageInNewChatRoom } from "#/api/mutations/chat/createNewChatMessageInNewChatRoom";
import { FormStateProvider, useFormState } from "../FormContext";
import { NewMessageInNewChatRoomFormInput } from "./NewMessageInNewChatRoomFormInput";

const NewMessageInNewChatRoomInner = ({ userIds }: { userIds: string[] }) => {
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
    <>
      <br />
      <h3>New Message:</h3>
      <br />
      <form onSubmit={onSubmitNewChatMessage}>
        <NewMessageInNewChatRoomFormInput />
      </form>
    </>
  );
};

export const NewMessageInNewChatRoom = ({ userIds }: { userIds: string[] }) => {
  return (
    <FormStateProvider>
      <NewMessageInNewChatRoomInner userIds={userIds} />
    </FormStateProvider>
  );
};
