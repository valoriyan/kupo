import { KeyboardEvent } from "react";
import { styled } from "#/styling";
import { useFormState } from "./FormContext";

export const NewMessageInput = ({
  onSubmitNewChatMessage,
}: {
  onSubmitNewChatMessage(event: React.FormEvent): Promise<void>;
}) => {
  const { newChatMessage, setNewChatMessage } = useFormState();

  async function onUpdateNewChatMessage(event: React.ChangeEvent<HTMLTextAreaElement>) {
    event.preventDefault();

    setNewChatMessage(event.currentTarget.value);
  }

  async function onKeyPress(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key == "Enter" && event.shiftKey == false) {
      onSubmitNewChatMessage(event);
    }
  }

  return (
    <div>
      <ChatMessageInputForm onSubmit={onSubmitNewChatMessage}>
        <ChatMessageInput
          onKeyDown={onKeyPress}
          placeholder="type a message..."
          value={newChatMessage}
          onChange={onUpdateNewChatMessage}
        />
        <SendButton>Send</SendButton>
      </ChatMessageInputForm>
    </div>
  );
};

const ChatMessageInputForm = styled("form", {
  width: "100%",
  height: "100%",
  display: "inline-block",
});

const ChatMessageInput = styled("textarea", {
  width: "100%",
  height: "100%",
  padding: "$4",
  resize: "none",
  display: "inline-block",
  border: "none",
});

const SendButton = styled("button", {
  backgroundColor: "$secondary",
  border: "none",
  padding: "$3",
  float: "right",
});
