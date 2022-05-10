import Link from "next/link";
import { useRouter } from "next/router";
import { useGetClientUserProfile } from "#/api/queries/users/useGetClientUserProfile";
import { logout } from "#/contexts/auth";
import { setPreviousLocationForMessages } from "#/pages/messages";
import { setPreviousLocationForMyLists } from "#/pages/my-lists";
import { setPreviousLocationForSettings } from "#/pages/settings";
import { styled } from "#/styling";
import { setPreviousLocationForAddContent } from "#/templates/AddContent";
import { ErrorMessage } from "../ErrorArea";
import {
  BellIcon,
  BookmarkIcon,
  HomeIcon,
  ListIcon,
  LogOutIcon,
  MailIcon,
  OptionsIcon,
  SupportIcon,
} from "../Icons";
import { Flex, Stack } from "../Layout";
import { LoadingArea } from "../LoadingArea";
import { ScrollArea } from "../ScrollArea";
import { NavItem, NavLink, SidePanelWrapper, UploadLink } from "./shared";
import { UserInfo } from "./UserInfo";
import { useWebsocketState } from "./WebsocketContext";

export const SidePanel = () => {
  const { data, isLoading, error } = useGetClientUserProfile();
  const { notificationsReceived, countOfExistingUnreadNotifications } =
    useWebsocketState();
  const router = useRouter();

  const isActive = (href: string) => {
    return router.asPath.includes(href);
  };

  const countOfUnreadNotifications =
    countOfExistingUnreadNotifications + notificationsReceived.length;

  const notificationsIndicator = !countOfUnreadNotifications ? null : (
    <NotificationBadge>
      {countOfUnreadNotifications > 99 ? "99+" : countOfUnreadNotifications}
    </NotificationBadge>
  );

  if (error && !isLoading) {
    return <ErrorMessage>{error.message}</ErrorMessage>;
  }

  if (isLoading || !data) {
    return <LoadingArea size="lg" />;
  }

  const activeColor = "$text";
  const inactiveColor = "$secondaryText";

  return (
    <SidePanelWrapper>
      <Stack css={{ gap: "$5", px: "$8" }}>
        <UserInfoWrapper>
          <UserInfo />
        </UserInfoWrapper>
        <Link href="/add-content" passHref>
          <UploadLink onClick={setPreviousLocationForAddContent}>Create</UploadLink>
        </Link>
      </Stack>
      <ScrollArea>
        <Stack css={{ gap: "$9", px: "$8", height: "100%" }}>
          <Stack css={{ gap: "$6" }}>
            <NavLink
              href="/feed"
              Icon={HomeIcon}
              label="Home"
              color={isActive("/feed") ? activeColor : inactiveColor}
            />
            <NavLink
              href="/notifications"
              Icon={BellIcon}
              label={
                <Flex css={{ alignItems: "center", gap: "$3" }}>
                  Notifications
                  {notificationsIndicator}
                </Flex>
              }
              color={isActive("/notifications") ? activeColor : inactiveColor}
            />
            <NavLink
              href="/messages"
              Icon={MailIcon}
              label="Messages"
              onClick={setPreviousLocationForMessages}
              color={isActive("/messages") ? activeColor : inactiveColor}
            />
            <NavLink
              href="/my-lists"
              Icon={ListIcon}
              label="My Lists"
              onClick={setPreviousLocationForMyLists}
              color={isActive("/my-lists") ? activeColor : inactiveColor}
            />
            <NavLink
              href="/saved-posts"
              Icon={BookmarkIcon}
              label="Saved Posts"
              color={isActive("/saved-posts") ? activeColor : inactiveColor}
            />
            <NavLink
              href="/settings"
              Icon={OptionsIcon}
              label="Settings"
              onClick={setPreviousLocationForSettings}
              color={isActive("/settings") ? activeColor : inactiveColor}
            />
          </Stack>
          <Stack css={{ gap: "$6" }}>
            <NavLink
              href="/support"
              Icon={SupportIcon}
              label="Support"
              color={isActive("/support") ? activeColor : inactiveColor}
            />
            <NavItem
              as="button"
              css={{ color: "$secondaryText", pb: "$8" }}
              onClick={logout}
            >
              <LogOutIcon />
              <div>Log Out</div>
            </NavItem>
          </Stack>
        </Stack>
      </ScrollArea>
    </SidePanelWrapper>
  );
};

const UserInfoWrapper = styled("div", {
  display: "grid",
  gridTemplateColumns: "auto auto",
  alignItems: "start",
  columnGap: "$5",
});

const NotificationBadge = styled(Flex, {
  justifyContent: "center",
  alignItems: "center",
  height: "20px",
  minWidth: "20px",
  px: "$",
  fontSize: "$0",
  fontWeight: "$bold",
  bg: "$failure",
  color: "$accentText",
  borderRadius: "$round",
});
