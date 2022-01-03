import Link from "next/link";
import { RenderableUser } from "#/api";
import { RenderableChatRoom } from "#/api/generated/types/renderable-chat-room";
import { Avatar } from "#/components/Avatar";
import { Flex } from "#/components/Layout";
import { styled } from "#/styling";

export const ChatRoomListItem = ({
  chatRoom,
  clientUserData,
}: {
  chatRoom: RenderableChatRoom;
  clientUserData: RenderableUser;
}) => {
  const { chatRoomId, members } = chatRoom;

  const memberUserProfilePictures = members.map(
    (member) => member.profilePictureTemporaryUrl,
  );

  const firstMemberUserProfilePicture =
    memberUserProfilePictures.length > 0 ? memberUserProfilePictures[0] : undefined;

  const nonClientChatRoomMembers = members.filter(
    (member) => member.userId !== clientUserData.userId,
  );

  const chatRoomMembersDisplay = nonClientChatRoomMembers.map((member, index, lst) => {
    return (
      <Username key={member.userId}>
        @{member.username}
        {index < lst.length - 1 ? "," : null}
      </Username>
    );
  });

  return (
    <FlexWrapperContainer>
      <Link href={`/messages/${chatRoomId}`} passHref>
        <a>
          <Avatar src={firstMemberUserProfilePicture} alt="Chat Room Avatar Image" />
        </a>
      </Link>

      <Usernames>{chatRoomMembersDisplay}</Usernames>
    </FlexWrapperContainer>
  );
};

const FlexWrapperContainer = styled(Flex, {
  padding: "$5",
  alignItems: "center",
  borderWidth: "$1",
  borderTop: "solid $primaryTranslucent",
  borderBottom: "solid $primaryTranslucent",
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
