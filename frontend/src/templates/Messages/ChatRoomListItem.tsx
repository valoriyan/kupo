import Link from "next/link";
import { StackedAvatars } from "#/components/Avatar/StackedAvatars";
import { bodyStyles } from "#/components/Typography";
import { styled } from "#/styling";
import { RenderableChatRoomWithJoinedUsers } from "#/api";
import { Flex } from "#/components/Layout";

export interface ChatRoomListProps {
  chatRoom: RenderableChatRoomWithJoinedUsers;
  clientUserId: string;
}

export const ChatRoomListItem = ({ chatRoom, clientUserId }: ChatRoomListProps) => {
  const { chatRoomId, hasUnreadMessages, members } = chatRoom;

  const nonClientMembers = members.filter((member) => member.userId !== clientUserId);

  const chatRoomMembersDisplay = nonClientMembers.map((member, index, list) => (
    <Username key={index}>
      @{member.username}
      {index < list.length - 1 ? ", " : null}
    </Username>
  ));

  return (
    <Link href={`/messages/${chatRoomId}`} passHref>
      <Wrapper>
        <Flex css={{ alignItems: "center", gap: "$4" }}>
          <StackedAvatars
            size="$8"
            images={nonClientMembers.map((member) => ({
              alt: `${member.username}'s profile picture`,
              src: member.profilePictureTemporaryUrl,
            }))}
          />
          <div>{chatRoomMembersDisplay}</div>
        </Flex>
        {hasUnreadMessages && <NotificationDot />}
      </Wrapper>
    </Link>
  );
};

const Wrapper = styled("a", {
  display: "flex",
  p: "$5",
  gap: "$4",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: "solid $borderWidths$1 $border",
});

const Username = styled("span", bodyStyles, {
  color: "$primary",
  fontWeight: "$bold",
});

const NotificationDot = styled("div", {
  size: "$4",
  borderRadius: "$round",
  bg: "$failure",
});
