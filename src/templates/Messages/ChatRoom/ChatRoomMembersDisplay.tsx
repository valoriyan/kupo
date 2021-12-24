import Link from "next/link";
import { RenderableUser } from "#/api";
import { Avatar } from "#/components/Avatar";
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

  const chatRoomMemberUsernames = nonClientChatRoomMembersWithData.map(
    (chatRoomMember, index) => {
      const { username, userId } = chatRoomMember!;
      return (
        <Link key={userId} href={`/user/${userId}`}>
          <Username>
            @{username}
            {index < nonClientChatRoomMembersWithData.length - 1 ? "," : null}
          </Username>
        </Link>
      );
    },
  );

  return (
    <Wrapper>
      <Avatar src={chatRoomAvatarImage} alt="Chat Room Avatar Image" size="$8" />
      <Usernames>{chatRoomMemberUsernames}</Usernames>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  padding: "$5",
  display: "flex",
  alignItems: "center",
  borderBottom: "3px solid $primaryTranslucent",
});

const Usernames = styled("div", {
  paddingLeft: "$5",
});

const Username = styled("span", {
  paddingLeft: "$2",
  color: "$link",
  fontSize: "$4",
  cursor: "pointer",
});
