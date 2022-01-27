import Link from "next/link";
import { logout } from "#/contexts/auth";
import { styled } from "#/styling";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";
import { ErrorMessage } from "../ErrorArea";
import {
  BellIcon,
  BookmarkIcon,
  BoxIcon,
  GirlIcon,
  HomeIcon,
  ListIcon,
  LogOutIcon,
  MailIcon,
  OptionsIcon,
  SupportIcon,
} from "../Icons";
import { Stack } from "../Layout";
import { LoadingArea } from "../LoadingArea";
import { NavItem, NavLink, SidePanelWrapper, UploadLink } from "./shared";
import { UserInfo } from "./UserInfo";
import { useWebsocketState } from "./WebsocketContext";
import { useGetClientUserProfile } from "#/api/queries/users/useGetClientUserProfile";

export const SidePanel = () => {
  const { data, isLoading, error } = useGetClientUserProfile();
  const { notificationsReceived } = useWebsocketState();

  const notificationsIndicator =
    notificationsReceived.length === 0 ? "" : ` (${notificationsReceived.length})`;

  if (error && !isLoading) {
    return <ErrorMessage>{error.message}</ErrorMessage>;
  }

  if (isLoading || !data) {
    return <LoadingArea size="lg" />;
  }

  const { username } = data;

  return (
    <SidePanelWrapper>
      <Stack css={{ gap: "$5" }}>
        <UserInfoWrapper>
          <UserInfo />
        </UserInfoWrapper>
        <Link href="/add-content" passHref>
          <UploadLink>Create</UploadLink>
        </Link>
      </Stack>
      <Stack css={{ gap: "$9", height: "100%", overflow: "auto" }}>
        <Stack css={{ gap: "$6" }}>
          <NavLink href="/feed" Icon={HomeIcon} label="Home" />
          <NavLink
            href="/notifications"
            Icon={BellIcon}
            label={`Notifications${notificationsIndicator}`}
          />
          <NavLink href="/messages" Icon={MailIcon} label="Messages" />
          <NavLink
            href={getProfilePageUrl({ username })}
            Icon={GirlIcon}
            label="My Profile"
          />
          <NavLink href="/lists" Icon={ListIcon} label="My Lists" />
          <NavLink href="/saved" Icon={BookmarkIcon} label="Saved Posts" />
          <NavLink href="/purchases" Icon={BoxIcon} label="Purchases" />
          <NavLink href="/settings" Icon={OptionsIcon} label="Settings" />
        </Stack>
        <Stack css={{ gap: "$6" }}>
          <NavLink href="/support" Icon={SupportIcon} label="Support" />
          <NavItem as="button" css={{ color: "$link", pb: "$8" }} onClick={logout}>
            <LogOutIcon />
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
  columnGap: "$5",
});
