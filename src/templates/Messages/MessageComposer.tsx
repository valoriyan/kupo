import { KeyboardEvent } from "react";
import { Button } from "#/components/Button";
import { styled } from "#/styling";

export interface MessageComposerProps {
  newChatMessage: string;
  setNewChatMessage: (newChatMessage: string) => void;
  onSubmitNewChatMessage: (event: React.FormEvent) => Promise<void>;
  disabled?: boolean;
}

export const MessageComposer = ({
  newChatMessage,
  setNewChatMessage,
  onSubmitNewChatMessage,
  disabled,
}: MessageComposerProps) => {
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
        data-cy="chat-room-message-input"
      />
      <ActionBar>
        <Button
          round
          size="sm"
          disabled={!newChatMessage || disabled}
          data-cy="submit-chat-message-button"
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
