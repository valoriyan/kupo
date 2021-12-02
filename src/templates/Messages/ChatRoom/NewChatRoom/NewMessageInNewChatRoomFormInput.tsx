import { useFormState } from "../FormContext";

export const NewMessageInNewChatRoomFormInput = () => {
  const { newChatMessage, setNewChatMessage } = useFormState();

  async function onChangeNewChatMessage(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();

    setNewChatMessage(event.currentTarget.value);
  }

  return <input value={newChatMessage} onChange={onChangeNewChatMessage} type="text" />;
};
