import { logout } from "#/contexts/auth";
import { styled } from "#/styling";
import { generateUserProfilePageUrl } from "#/utils/generateLinkUrls";
import { Bookmark, Box, Close, Girl, List, LogOut, Options, Support } from "../Icons";
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
        <UserInfo />
        <Flex as="button" onClick={hide}>
          <Close />
        </Flex>
      </UserInfoWrapper>
      <Stack css={{ gap: "$8", px: "$7", py: "$7" }}>
        <Stack css={{ gap: "$5" }}>
          <NavLink
            href={generateUserProfilePageUrl({ username })}
            Icon={Girl}
            label="My Profile"
            onClick={hide}
          />
          <NavLink href="/lists" Icon={List} label="My Lists" onClick={hide} />
          <NavLink href="/saved" Icon={Bookmark} label="Saved Posts" onClick={hide} />
          <NavLink href="/purchases" Icon={Box} label="Purchases" onClick={hide} />
          <NavLink href="/settings" Icon={Options} label="Settings" onClick={hide} />
        </Stack>
        <Stack css={{ gap: "$5" }}>
          <NavLink href="/support" Icon={Support} label="Support" onClick={hide} />
          <NavItem
            as="button"
            css={{ color: "$link" }}
            onClick={() => {
              hide();
              logout();
            }}
          >
            <LogOut />
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
  columnGap: "$4",
  p: "$4",
  borderBottomStyle: "solid",
  borderBottomColor: "$text",
  borderBottomWidth: "1px",
  "> *:first-child": { alignSelf: "center" },
});
