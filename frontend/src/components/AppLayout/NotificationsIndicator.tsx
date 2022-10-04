import { useGetCountOfUnreadNotifications } from "#/api/queries/notifications/useGetCountOfUnreadNotifications";
import { styled } from "#/styling";
import { Flex } from "../Layout";
import { useWebsocketState } from "./WebsocketContext";

export const NotificationsIndicator = () => {
  const { updatedCountOfUnreadNotifications } = useWebsocketState();

  const { data: staleCountOfUnreadNotifications } = useGetCountOfUnreadNotifications();

  const countOfUnreadNotifications =
    updatedCountOfUnreadNotifications ?? staleCountOfUnreadNotifications ?? 0;

  const displayedCountOfUnreadNotifications =
    countOfUnreadNotifications > 99 ? "99+" : countOfUnreadNotifications;

  return !countOfUnreadNotifications ? null : (
    <NotificationBadge>{displayedCountOfUnreadNotifications}</NotificationBadge>
  );
};

const NotificationBadge = styled(Flex, {
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
