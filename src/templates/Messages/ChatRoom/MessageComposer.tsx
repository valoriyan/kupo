import { KeyboardEvent } from "react";
import { styled } from "#/styling";
import { useFormState } from "./FormContext";
import { Button } from "#/components/Button";

export interface MessageComposerProps {
  onSubmitNewChatMessage: (event: React.FormEvent) => Promise<void>;
}

export const MessageComposer = ({ onSubmitNewChatMessage }: MessageComposerProps) => {
  const { newChatMessage, setNewChatMessage } = useFormState();

  function onUpdateNewChatMessage(event: React.ChangeEvent<HTMLTextAreaElement>) {
    event.preventDefault();
    setNewChatMessage(event.currentTarget.value);
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && event.shiftKey === false) {
      onSubmitNewChatMessage(event);
    }
  }

  return (
    <Wrapper onSubmit={onSubmitNewChatMessage}>
      <MessageInput
        rows={3}
        onKeyDown={onKeyDown}
        placeholder="type a message..."
        value={newChatMessage}
        onChange={onUpdateNewChatMessage}
      />
      <ActionBar>
        <Button
          round
          size="sm"
          onClick={onSubmitNewChatMessage}
          disabled={!newChatMessage}
        >
          Send
        </Button>
      </ActionBar>
    </Wrapper>
  );
};

const Wrapper = styled("form", {
  display: "flex",
  flexDirection: "column",
});

const MessageInput = styled("textarea", {
  size: "100%",
  p: "$4",
  resize: "none",
  display: "inline-block",
  bg: "$background3",
  border: "none",
  borderY: "solid $borderWidths$1 $border",
  transition: "border-color $1 ease",

  "&:focus": {
    outline: "none",
    borderColor: "$primary",
  },

  "&::placeholder": {
    color: "$secondaryText",
  },
});

const ActionBar = styled("div", {
  display: "flex",
  px: "$4",
  py: "$3",
  alignItems: "center",
  justifyContent: "flex-end",
  bg: "$background2",
});
