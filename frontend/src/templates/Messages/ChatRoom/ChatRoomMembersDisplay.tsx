import { RenderableUser } from "#/api";
import { StackedAvatars } from "#/components/Avatar";
import { Box } from "#/components/Layout";
import { UserName } from "#/components/UserName";
import {
  MAX_APP_CONTENT_WIDTH,
  NESTED_PAGE_LAYOUT_HEADER_HEIGHT,
  SIDE_PANEL_WIDTH,
} from "#/constants";
import { styled } from "#/styling";
import { translucentBg } from "#/styling/mixins";

export interface ChatRoomMembersDisplayProps {
  chatRoomMembers: RenderableUser[];
}

export const ChatRoomMembersDisplay = ({
  chatRoomMembers,
}: ChatRoomMembersDisplayProps) => {
  const chatRoomMemberUsernames = chatRoomMembers.flatMap((chatRoomMember, index) => {
    if (!chatRoomMember) return [];
    const { username, userId } = chatRoomMember;
    return [
      <Box as="span" key={userId} css={{ color: "$link" }}>
        <UserName username={username} />
        {index < chatRoomMembers.length - 1 ? ", " : null}
      </Box>,
    ];
  });

  return (
    <Wrapper>
      <StackedAvatars
        size="$7"
        images={chatRoomMembers.map((member) => ({
          alt: `${member.username}'s profile picture`,
          src: member.profilePictureTemporaryUrl,
        }))}
      />
      <div>{chatRoomMemberUsernames}</div>
    </Wrapper>
  );
};

const Wrapper = styled("div", translucentBg, {
  position: "fixed",
  top: NESTED_PAGE_LAYOUT_HEADER_HEIGHT,
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  gap: "$4",
  p: "$4",
  borderBottom: "solid $borderWidths$1 $border",
  width: "100%",
  "@md": {
    width: `calc(100vw - ${SIDE_PANEL_WIDTH})`,
    maxWidth: MAX_APP_CONTENT_WIDTH,
  },
});
