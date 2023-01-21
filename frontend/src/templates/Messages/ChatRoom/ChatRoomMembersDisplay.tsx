import { RenderableUser } from "#/api";
import { StackedAvatars } from "#/components/Avatar";
import { Box } from "#/components/Layout";
import { UserName } from "#/components/UserName";
import { styled } from "#/styling";

export interface ChatRoomMembersDisplayProps {
  chatRoomMembers: Array<RenderableUser | null>;
  clientUser: RenderableUser;
}

export const ChatRoomMembersDisplay = ({
  chatRoomMembers,
  clientUser,
}: ChatRoomMembersDisplayProps) => {
  const members = chatRoomMembers.filter(memberHasData);
  const isSelfChat = members.length === 1 && members[0].userId === clientUser.userId;

  const membersToDisplay = isSelfChat
    ? members
    : members.filter((member) => member.userId !== clientUser.userId);

  const chatRoomMemberUsernames = membersToDisplay.flatMap((chatRoomMember, index) => {
    if (!chatRoomMember) return [];
    const { username, userId } = chatRoomMember;
    return [
      <Box as="span" key={userId} css={{ color: "$link" }}>
        <UserName username={username} />
        {index < membersToDisplay.length - 1 ? ", " : null}
      </Box>,
    ];
  });

  return (
    <Wrapper>
      <StackedAvatars
        size="$7"
        images={membersToDisplay.map((member) => ({
          alt: `${member.username}'s profile picture`,
          src: member.profilePictureTemporaryUrl,
        }))}
      />
      <div>{chatRoomMemberUsernames}</div>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$4",
  p: "$4",
  borderBottom: "solid $borderWidths$1 $border",
});

const memberHasData = (member: RenderableUser | null): member is RenderableUser =>
  !!member;
