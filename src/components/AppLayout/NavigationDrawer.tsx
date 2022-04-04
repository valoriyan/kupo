import { logout } from "#/contexts/auth";
import { setPreviousLocationForMessages } from "#/pages/messages";
import { setPreviousLocationForMyLists } from "#/pages/my-lists";
import { setPreviousLocationForSettings } from "#/pages/settings";
import { styled } from "#/styling";
import {
  BellIcon,
  BookmarkIcon,
  CloseIcon,
  HomeIcon,
  ListIcon,
  LogOutIcon,
  MailIcon,
  OptionsIcon,
  SupportIcon,
} from "../Icons";
import { Flex, Stack } from "../Layout";
import { NavItem, NavLink } from "./shared";
import { UserInfo } from "./UserInfo";

export interface NavigationDrawerProps {
  hide: () => void;
}

export const NavigationDrawer = ({ hide }: NavigationDrawerProps) => {
  return (
    <Wrapper>
      <UserInfoWrapper>
        <UserInfo onUsernameClick={hide} />
        <Flex as="button" onClick={hide}>
          <CloseIcon />
        </Flex>
      </UserInfoWrapper>
      <Stack css={{ gap: "$9", px: "$8", py: "$8" }}>
        <Stack css={{ gap: "$6" }}>
          <NavLink href="/feed" Icon={HomeIcon} label="Home" onClick={hide} />
          <NavLink
            href="/notifications"
            Icon={BellIcon}
            label="Notifications"
            onClick={hide}
          />
          <NavLink
            href="/messages"
            Icon={MailIcon}
            label="Messages"
            onClick={() => {
              setPreviousLocationForMessages();
              hide();
            }}
          />
          <NavLink
            href="/my-lists"
            Icon={ListIcon}
            label="My Lists"
            onClick={() => {
              setPreviousLocationForMyLists();
              hide();
            }}
          />
          <NavLink href="/saved" Icon={BookmarkIcon} label="Saved Posts" onClick={hide} />
          <NavLink
            href="/settings"
            Icon={OptionsIcon}
            label="Settings"
            onClick={() => {
              setPreviousLocationForSettings();
              hide();
            }}
          />
        </Stack>
        <Stack css={{ gap: "$6" }}>
          <NavLink href="/support" Icon={SupportIcon} label="Support" onClick={hide} />
          <NavItem
            as="button"
            css={{ color: "$text" }}
            onClick={() => {
              hide();
              logout();
            }}
          >
            <LogOutIcon />
            <div>Log Out</div>
          </NavItem>
        </Stack>
      </Stack>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  bg: "$background1",
  height: "100%",
  flexDirection: "column",
});

const UserInfoWrapper = styled("div", {
  display: "grid",
  gridTemplateColumns: "auto auto auto",
  alignItems: "start",
  columnGap: "$5",
  p: "$5",
  borderBottomStyle: "solid",
  borderBottomColor: "$text",
  borderBottomWidth: "1px",
  "> *:first-child": { alignSelf: "center" },
});
