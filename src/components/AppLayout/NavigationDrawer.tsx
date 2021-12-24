import { logout } from "#/contexts/auth";
import { styled } from "#/styling";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";
import {
  BookmarkIcon,
  BoxIcon,
  CloseIcon,
  GirlIcon,
  ListIcon,
  LogOutIcon,
  OptionsIcon,
  SupportIcon,
} from "../Icons";
import { Flex, Stack } from "../Layout";
import { NavItem, NavLink } from "./shared";
import { UserInfo } from "./UserInfo";

export interface NavigationDrawerProps {
  hide: () => void;
  username: string;
}

export const NavigationDrawer = ({ hide, username }: NavigationDrawerProps) => {
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
          <NavLink
            href={getProfilePageUrl({ username })}
            Icon={GirlIcon}
            label="My Profile"
            onClick={hide}
          />
          <NavLink href="/lists" Icon={ListIcon} label="My Lists" onClick={hide} />
          <NavLink href="/saved" Icon={BookmarkIcon} label="Saved Posts" onClick={hide} />
          <NavLink href="/purchases" Icon={BoxIcon} label="Purchases" onClick={hide} />
          <NavLink href="/settings" Icon={OptionsIcon} label="Settings" onClick={hide} />
        </Stack>
        <Stack css={{ gap: "$6" }}>
          <NavLink href="/support" Icon={SupportIcon} label="Support" onClick={hide} />
          <NavItem
            as="button"
            css={{ color: "$link" }}
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
