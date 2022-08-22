import Link from "next/link";
import { useRouter } from "next/router";
import { useGetClientUserProfile } from "#/api/queries/users/useGetClientUserProfile";
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
import { openLogOutModal } from "../LogOutModal";
import { ScrollArea } from "../ScrollArea";
import { NotificationsIndicator } from "./NotificationsIndicator";
import { NavItem, NavLink, SidePanelWrapper, UploadLink } from "./shared";
import { UserInfo } from "./UserInfo";
import { UnreadMessagesIndicator } from "./UnreadMessagesIndicator";

export const SidePanel = () => {
  const { data, isLoading, error } = useGetClientUserProfile();
  const router = useRouter();

  const isActive = (href: string) => {
    return router.asPath.includes(href);
  };

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
              data-cy="home-button"
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
              onClick={setPreviousLocationForMessages}
              color={isActive("/messages") ? activeColor : inactiveColor}
              data-cy="chat-button"
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
              onClick={() => openLogOutModal()}
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
