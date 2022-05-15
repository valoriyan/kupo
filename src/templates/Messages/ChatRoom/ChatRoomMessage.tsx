import { DateTime } from "luxon";
import { RenderableChatMessage } from "#/api";
import { Stack } from "#/components/Layout";
import { Subtext } from "#/components/Typography";
import { styled } from "#/styling";

export interface ChatRoomMessageProps {
  message: RenderableChatMessage;
  isClientMessage: boolean;
}

export const ChatRoomMessage = ({ message, isClientMessage }: ChatRoomMessageProps) => {
  const formattedTimestamp = DateTime.fromMillis(
    message.creationTimestamp,
  ).toLocaleString(DateTime.TIME_SIMPLE);

  return (
    <Wrapper css={{ bg: isClientMessage ? "$primaryTranslucent" : "$background3" }}>
      <div>{message.text}</div>
      <Subtext
        css={{
          fontSize: "$0",
          color: "$secondaryText",
          alignSelf: isClientMessage ? "flex-end" : "flex-start",
        }}
      >
        {formattedTimestamp}
      </Subtext>
    </Wrapper>
  );
};

const Wrapper = styled(Stack, {
  maxWidth: "70%",
  color: "$text",
  borderRadius: "$4",
  p: "$4",
  gap: "$3",
});
