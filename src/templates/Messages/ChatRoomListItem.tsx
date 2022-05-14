import Link from "next/link";
import { RenderableChatRoom } from "#/api/generated/types/renderable-chat-room";
import { StackedAvatars } from "#/components/Avatar/StackedAvatars";
import { bodyStyles } from "#/components/Typography";
import { styled } from "#/styling";

export interface ChatRoomListProps {
  chatRoom: RenderableChatRoom;
  clientUserId: string;
}

export const ChatRoomListItem = ({ chatRoom, clientUserId }: ChatRoomListProps) => {
  const { chatRoomId, members } = chatRoom;

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
        <StackedAvatars
          size="$8"
          images={nonClientMembers.map((member) => ({
            alt: `${member.username}'s profile picture`,
            src: member.profilePictureTemporaryUrl,
          }))}
        />
        <div>{chatRoomMembersDisplay}</div>
      </Wrapper>
    </Link>
  );
};

const Wrapper = styled("a", {
  display: "flex",
  p: "$5",
  gap: "$4",
  alignItems: "center",
  borderBottom: "solid $borderWidths$1 $border",
});

const Username = styled("span", bodyStyles, {
  color: "$primary",
  fontWeight: "$bold",
});
