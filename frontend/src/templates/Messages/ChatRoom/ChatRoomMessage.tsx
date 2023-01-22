import { DateTime } from "luxon";
import { RenderableChatMessage, RenderableUser } from "#/api";
import { Avatar } from "#/components/Avatar";
import { Flex, Stack } from "#/components/Layout";
import { Body, Subtext } from "#/components/Typography";
import { styled } from "#/styling";
import { WithTags } from "#/components/WithTags";

export interface ChatRoomMessageProps {
  message: RenderableChatMessage;
  isClientMessage: boolean;
  isUserTransition: boolean | undefined;
  author: RenderableUser;
}

export const ChatRoomMessage = ({
  message,
  isClientMessage,
  isUserTransition,
  author,
}: ChatRoomMessageProps) => {
  const formattedTimestamp = DateTime.fromMillis(
    message.creationTimestamp,
  ).toLocaleString(DateTime.TIME_SIMPLE);

  const messageBubble = (
    <Wrapper
      css={{
        bg: isClientMessage ? "$primaryTranslucent" : "$background3",
        ml: isUserTransition === false && !isClientMessage ? "$8" : 0,
      }}
    >
      <Body as="pre" css={{ m: 0, whiteSpace: "pre-wrap" }}>
        <WithTags text={message.text} />
      </Body>
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

  if (!isUserTransition || isClientMessage) return messageBubble;

  return (
    <UserTransitionMessage>
      <Avatar
        size="$7"
        src={author.profilePictureTemporaryUrl}
        alt={`${author.username}'s profile picture`}
      />
      <Stack css={{ gap: "$2", flex: 1 }}>
        <Subtext css={{ color: "$secondaryText", ml: "$4" }}>{author.username}</Subtext>
        {messageBubble}
      </Stack>
    </UserTransitionMessage>
  );
};

const Wrapper = styled(Stack, {
  width: "fit-content",
  maxWidth: "70%",
  color: "$text",
  borderRadius: "$4",
  p: "$4",
  gap: "$3",
});

const UserTransitionMessage = styled(Flex, {
  gap: "$3",
  paddingTop: "$2",
  flex: 1,
  ">:first-child": { mt: "$6" },
});
