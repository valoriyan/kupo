import Link from "next/link";
import { useGetUserProfile } from "#/api/queries/useGetUserProfile";
import { styled } from "#/styling";
import { formatStat } from "#/utils/formatStat";
import { Avatar } from "../Avatar";
import { Flex } from "../Layout";
import { LoadingArea } from "../LoadingArea";
import { Subtext } from "../Typography";

export interface UserInfoProps {
  onUsernameClick?: () => void;
}

export const UserInfo = (props: UserInfoProps) => {
  const { data, isLoading } = useGetUserProfile({ isOwnProfile: true });

  return (
    <>
      <Avatar alt="User Avatar" />
      {isLoading ? (
        <UserStatsPlaceholder>
          <LoadingArea size="md" />
        </UserStatsPlaceholder>
      ) : (
        <Flex css={{ gap: "$2", flexDirection: "column" }}>
          <Link href="/profile" passHref>
            <a onClick={props.onUsernameClick}>@{data?.success?.username}</a>
          </Link>
          <Flex css={{ flexDirection: "column" }}>
            <UserStat>{formatStat(data?.success?.followers.count)} followers</UserStat>
            <UserStat>{formatStat(data?.success?.follows.count)} following</UserStat>
          </Flex>
        </Flex>
      )}
    </>
  );
};

const UserStatsPlaceholder = styled("div", { alignSelf: "center", width: "$10" });

const UserStat = styled(Subtext, { whiteSace: "nowrap" });
