import { RenderableUser } from "#/api";
import { RenderableChatRoom } from "#/api/generated/types/renderable-chat-room";
import { Avatar } from "#/components/Avatar";
import { Flex } from "#/components/Layout";
import { styled } from "#/styling";
import Link from "next/link";

export const ChatRoomListItem = ({ chatRoom, clientUserData }: { chatRoom: RenderableChatRoom; clientUserData: RenderableUser; }) => {
  const { chatRoomId, members } = chatRoom;

  const memberUserProfilePictures = members.map((member) => member.profilePictureTemporaryUrl);

  const firstMemberUserProfilePicture = memberUserProfilePictures.length > 0 ? memberUserProfilePictures[0] : undefined;

  const nonClientChatRoomMembers = members.filter(member => member.userId !== clientUserData.userId);

  const chatRoomMembersDisplay = nonClientChatRoomMembers.map((member, index, lst) => {
    return (
      <Username key={member.userId}>
        @{member.username}{index < lst.length - 1 ? "," : null}
      </Username>
    );
  })

  return (
    <FlexWrapperContainer>
      <Link href={`/messages/${chatRoomId}`}>
        <div>
          <Avatar src={firstMemberUserProfilePicture} alt="Chat Room Avatar Image" />
        </div>
      </Link>

      <Usernames>
        {chatRoomMembersDisplay}
      </Usernames>

    </FlexWrapperContainer>
  );
};

const FlexWrapperContainer = styled(Flex, {
  padding: "$4",
  alignItems: "center",
  borderTop: "1px solid $primaryTranslucent",
  borderBottom: "1px solid $primaryTranslucent",
});

const Usernames = styled("div", {
  paddingLeft: "$4",
});


const Username = styled("span", {
  paddingLeft: "$2",
  color: "$link",
  fontSize: "$4",
  cursor: "pointer",
});
