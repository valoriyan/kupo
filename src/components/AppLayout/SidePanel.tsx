import Link from "next/link";
import { logout } from "#/contexts/auth";
import { styled } from "#/styling";
import {
  Bell,
  Bookmark,
  Box,
  Girl,
  Home,
  List,
  LogOut,
  Mail,
  Options,
  Support,
} from "../Icons";
import { Stack } from "../Layout";
import { NavItem, NavLink, SidePanelWrapper, UploadLink } from "./shared";
import { UserInfo } from "./UserInfo";
import { useWebsocketState } from "./WebsocketContext";

export const SidePanel = () => {
  const { notificationsReceived } = useWebsocketState();

  const notificationsIndicator =
    notificationsReceived.length === 0 ? "" : ` (${notificationsReceived.length})`;

  return (
    <SidePanelWrapper>
      <Stack css={{ gap: "$4" }}>
        <UserInfoWrapper>
          <UserInfo />
        </UserInfoWrapper>
        <Link href="/add-content" passHref>
          <UploadLink>Create</UploadLink>
        </Link>
      </Stack>
      <Stack css={{ gap: "$8", height: "100%", overflow: "auto" }}>
        <Stack css={{ gap: "$5" }}>
          <NavLink href="/" Icon={Home} label="Home" />
          <NavLink
            href="/notifications"
            Icon={Bell}
            label={`Notifications${notificationsIndicator}`}
          />
          <NavLink href="/messages" Icon={Mail} label="Messages" />
          <NavLink href="/profile" Icon={Girl} label="My Profile" />
          <NavLink href="/lists" Icon={List} label="My Lists" />
          <NavLink href="/saved" Icon={Bookmark} label="Saved Posts" />
          <NavLink href="/purchases" Icon={Box} label="Purchases" />
          <NavLink href="/settings" Icon={Options} label="Settings" />
        </Stack>
        <Stack css={{ gap: "$5" }}>
          <NavLink href="/support" Icon={Support} label="Support" />
          <NavItem as="button" css={{ color: "$link", pb: "$7" }} onClick={logout}>
            <LogOut />
            <div>Log Out</div>
          </NavItem>
        </Stack>
      </Stack>
    </SidePanelWrapper>
  );
};

const UserInfoWrapper = styled("div", {
  display: "grid",
  gridTemplateColumns: "auto auto",
  alignItems: "start",
  columnGap: "$4",
});
