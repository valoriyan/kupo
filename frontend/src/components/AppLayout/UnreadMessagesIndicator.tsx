import { useGetCountOfUnreadChatRooms } from "#/api/queries/chat/useGetCountOfUnreadChatRooms";
import { styled } from "#/styling";
import { Flex } from "../Layout";
import { useWebsocketState } from "./WebsocketContext";

export const UnreadMessagesIndicator = () => {
  const { updatedCountOfUnreadChatRooms } = useWebsocketState();

  const { data: staleCountOfUnreadChatRooms } = useGetCountOfUnreadChatRooms();

  const countOfUnreadChatRooms =
    updatedCountOfUnreadChatRooms ?? staleCountOfUnreadChatRooms ?? 0;

  const displayedCountOfUnreadChatRooms =
    countOfUnreadChatRooms > 99 ? "99+" : countOfUnreadChatRooms;

  return (
    <UnreadChatRoomCountBadge
      css={{ visibility: countOfUnreadChatRooms ? "visible" : "hidden" }}
      data-cy="count-of-unread-chat-rooms"
    >
      {displayedCountOfUnreadChatRooms}
    </UnreadChatRoomCountBadge>
  );
};

const UnreadChatRoomCountBadge = styled(Flex, {
  justifyContent: "center",
  alignItems: "center",
  height: "20px",
  minWidth: "20px",
  fontSize: "$0",
  fontWeight: "$bold",
  lineHeight: 0,
  bg: "$failure",
  color: "$accentText",
  borderRadius: "$round",
});
