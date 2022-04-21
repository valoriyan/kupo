import { RenderableUser } from "#/api";
import { Avatar } from "#/components/Avatar";
import { Box } from "#/components/Layout";
import { UserName } from "#/components/UserName";
import { styled } from "#/styling";

export const ChatRoomMembersDisplay = ({
  chatRoomMembers,
  clientUser,
}: {
  chatRoomMembers: (RenderableUser | null)[];
  clientUser: RenderableUser;
}) => {
  const nonClientChatRoomMembersWithData = chatRoomMembers.filter(
    (chatRoomMember) => !!chatRoomMember && chatRoomMember.userId !== clientUser.userId,
  );

  const chatRoomAvatarImage =
    nonClientChatRoomMembersWithData.length > 0
      ? nonClientChatRoomMembersWithData[0]?.profilePictureTemporaryUrl
      : undefined;

  const chatRoomMemberUsernames = nonClientChatRoomMembersWithData.flatMap(
    (chatRoomMember, index) => {
      if (!chatRoomMember) return [];
      const { username, userId } = chatRoomMember;
      return [
        <Box as="span" key={userId} css={{ color: "$link" }}>
          <UserName username={username} />
          {index < nonClientChatRoomMembersWithData.length - 1 ? ", " : null}
        </Box>,
      ];
    },
  );

  return (
    <Wrapper>
      <Avatar src={chatRoomAvatarImage} alt="Chat Room Avatar Image" size="$7" />
      <div>{chatRoomMemberUsernames}</div>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  padding: "$5",
  display: "flex",
  alignItems: "center",
  gap: "$4",
  borderBottom: "solid $borderWidths$1 $border",
});
