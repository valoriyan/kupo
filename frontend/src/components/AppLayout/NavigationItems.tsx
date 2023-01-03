import { useRouter } from "next/router";
import { setPreviousLocationForMessages } from "#/pages/messages";
import { setPreviousLocationForMyLists } from "#/pages/my-lists";
import { setPreviousLocationForSettings } from "#/pages/settings";
import {
  BellIcon,
  BookmarkIcon,
  HomeIcon,
  ListIcon,
  LogOutIcon,
  MailIcon,
  OptionsIcon,
  SearchIcon,
  SupportIcon,
} from "../Icons";
import { Flex, Stack } from "../Layout";
import { openLogOutModal } from "../LogOutModal";
import { NotificationsIndicator } from "./NotificationsIndicator";
import { NavItem, NavLink } from "./shared";
import { UnreadMessagesIndicator } from "./UnreadMessagesIndicator";

export interface NavigationItemsProps {
  onItemClick?: () => void;
}

export const NavigationItems = ({ onItemClick }: NavigationItemsProps) => {
  const router = useRouter();

  const isActive = (href: string) => {
    return router.asPath.includes(href);
  };

  const activeColor = "$text";
  const inactiveColor = "$secondaryText";

  return (
    <>
      <Stack css={{ gap: "$6" }}>
        <NavLink
          href="/feed"
          Icon={HomeIcon}
          label="Home"
          onClick={onItemClick}
          color={isActive("/feed") ? activeColor : inactiveColor}
          data-cy="home-button"
        />
        <NavLink
          href="/discover"
          Icon={SearchIcon}
          label="Discover"
          onClick={onItemClick}
          color={isActive("/discover") ? activeColor : inactiveColor}
          data-cy="discover-button"
        />
        <NavLink
          href="/notifications"
          Icon={BellIcon}
          label={
            <Flex css={{ alignItems: "center", gap: "$3" }}>
              Notifications
              <NotificationsIndicator />
            </Flex>
          }
          onClick={onItemClick}
          color={isActive("/notifications") ? activeColor : inactiveColor}
        />
        <NavLink
          href="/messages"
          Icon={MailIcon}
          label={
            <Flex css={{ alignItems: "center", gap: "$3" }}>
              Messages
              <UnreadMessagesIndicator />
            </Flex>
          }
          onClick={() => {
            setPreviousLocationForMessages();
            onItemClick?.();
          }}
          color={isActive("/messages") ? activeColor : inactiveColor}
          data-cy="chat-button"
        />
        <NavLink
          href="/my-lists"
          Icon={ListIcon}
          label="My Lists"
          onClick={() => {
            setPreviousLocationForMyLists();
            onItemClick?.();
          }}
          color={isActive("/my-lists") ? activeColor : inactiveColor}
        />
        <NavLink
          href="/saved-posts"
          Icon={BookmarkIcon}
          label="Saved Posts"
          onClick={onItemClick}
          color={isActive("/saved-posts") ? activeColor : inactiveColor}
        />
        <NavLink
          href="/settings"
          Icon={OptionsIcon}
          label="Settings"
          onClick={() => {
            setPreviousLocationForSettings();
            onItemClick?.();
          }}
          color={isActive("/settings") ? activeColor : inactiveColor}
        />
      </Stack>
      <Stack css={{ gap: "$6" }}>
        <NavLink
          href="/support"
          Icon={SupportIcon}
          label="Support"
          onClick={onItemClick}
          color={isActive("/support") ? activeColor : inactiveColor}
        />
        <NavItem
          as="button"
          css={{ color: "$secondaryText", pb: "$8" }}
          onClick={() => openLogOutModal()}
        >
          <LogOutIcon />
          <div data-cy="logout-button">Log Out</div>
        </NavItem>
      </Stack>
    </>
  );
};
