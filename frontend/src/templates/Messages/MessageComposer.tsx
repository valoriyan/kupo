import { FormEvent, KeyboardEvent } from "react";
import { Button } from "#/components/Button";
import { Subtext } from "#/components/Typography";
import { UserAutoComplete } from "#/components/UserAutoComplete";
import { styled } from "#/styling";
import { useWarnUnsavedChanges } from "#/utils/useWarnUnsavedChanges";

const MESSAGE_CHAR_LIMIT = 5000;

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
  const clearWarning = useWarnUnsavedChanges(!!newChatMessage);

  function onSubmit(event: FormEvent<Element>) {
    event.preventDefault();
    clearWarning();
    onSubmitNewChatMessage(event);
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && event.shiftKey === false) {
      onSubmit(event);
    }
  }

  return (
    <Wrapper onSubmit={onSubmit}>
      <UserAutoComplete text={newChatMessage} setText={setNewChatMessage} side="top">
        <MessageInput
          rows={3}
          onKeyDown={onKeyDown}
          placeholder="type a message..."
          value={newChatMessage}
          onChange={(e) => setNewChatMessage(e.currentTarget.value)}
          maxLength={MESSAGE_CHAR_LIMIT}
          data-cy="chat-room-message-input"
        />
      </UserAutoComplete>
      <ActionBar>
        <Subtext css={{ color: "$secondaryText" }}>
          {newChatMessage.length} / {MESSAGE_CHAR_LIMIT}
        </Subtext>
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
  justifyContent: "space-between",
  bg: "$background2",
});
