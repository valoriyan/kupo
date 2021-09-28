import Link from "next/link";
import { useGetUserProfile } from "#/api/queries/useGetUserProfile";
import { logout } from "#/contexts/auth";
import { styled } from "#/styling";
import { formatStat } from "#/utils/formatStat";
import { Avatar } from "../Avatar";
import { Close, LogOut } from "../Icons";
import { Flex } from "../Layout";
import { LoadingArea } from "../LoadingArea";
import { headingStyles, Subtext } from "../Typography";

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
            <LoadingArea size="md" />
          </UserStatsPlaceholder>
        ) : (
          <Flex css={{ gap: "$2", flexDirection: "column" }}>
            <Link href="/profile" passHref>
              <a onClick={hide}>@{data?.success?.username}</a>
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
        <NavItem
          as="button"
          css={{ color: "$primary" }}
          onClick={() => {
            hide();
            logout();
          }}
        >
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

const UserStat = styled(Subtext, { whiteSace: "nowrap" });

const NavItem = styled("a", headingStyles, {
  display: "flex",
  alignItems: "center",
  gap: "$4",
});
