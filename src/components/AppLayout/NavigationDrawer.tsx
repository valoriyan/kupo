import Link from "next/link";
import { useGetUserProfile } from "#/api/queries/useGetUserProfile";
import { logout } from "#/contexts/auth";
import { styled } from "#/styling";
import { Avatar } from "../Avatar";
import { Close, LogOut } from "../Icons";
import { Flex } from "../Layout";
import { LoadingArea } from "../LoadingArea";

export interface NavigationDrawerProps {
  hide: () => void;
}

export const NavigationDrawer = ({ hide }: NavigationDrawerProps) => {
  const { data, isLoading } = useGetUserProfile({ isOwnProfile: true });

  return (
    <Wrapper>
      <UserInfo>
        <Avatar alt="User Avatar" />
        {isLoading ? (
          <UserStatsPlaceholder>
            <LoadingArea size="medium" />
          </UserStatsPlaceholder>
        ) : (
          <Flex css={{ gap: "$2", flexDirection: "column" }}>
            <Link href="/profile" passHref>
              <a>@{data?.success?.username}</a>
            </Link>
            <Flex css={{ flexDirection: "column" }}>
              <UserStat>{formatStat(data?.success?.followers.count)} followers</UserStat>
              <UserStat>
                {formatStat(data?.success?.subscribers.count)} subscribers
              </UserStat>
              <UserStat>{formatStat(data?.success?.follows.count)} following</UserStat>
            </Flex>
          </Flex>
        )}
        <Flex as="button" onClick={hide}>
          <Close />
        </Flex>
      </UserInfo>
      <Flex css={{ flexDirection: "column", px: "$8", py: "$7" }}>
        <NavItem as="button" css={{ color: "$primary" }} onClick={logout}>
          <LogOut />
          <div>Log Out</div>
        </NavItem>
      </Flex>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  bg: "$background1",
  height: "100%",
  flexDirection: "column",
});

const UserInfo = styled("div", {
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

const UserStatsPlaceholder = styled("div", { alignSelf: "center", width: "$10" });

const UserStat = styled("div", {
  whiteSace: "nowrap",
  fontSize: "$1",
});

const formatStat = (stat: number | undefined) => {
  if (!stat) return 0;
  return stat >= 1000 ? (stat / 1000).toFixed(1) + "k" : stat;
};

const NavItem = styled("a", {
  display: "flex",
  alignItems: "center",
  gap: "$4",
  fontSize: "$3",
});
