import Link from "next/link";
import { styled } from "#/styling";
import { formatStat } from "#/utils/formatStat";
import { Avatar } from "../Avatar";
import { Flex } from "../Layout";
import { LoadingArea } from "../LoadingArea";
import { Subtext } from "../Typography";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";
import { useGetClientUserProfile } from "#/api/queries/users/useGetClientUserProfile";

export interface UserInfoProps {
  onUsernameClick?: () => void;
}

export const UserInfo = (props: UserInfoProps) => {
  const { data, isLoading } = useGetClientUserProfile();

  return (
    <>
      <Avatar alt="User Avatar" src={data?.profilePictureTemporaryUrl} />
      {isLoading || !data ? (
        <UserStatsPlaceholder>
          <LoadingArea size="md" />
        </UserStatsPlaceholder>
      ) : (
        <Flex css={{ gap: "$2", flexDirection: "column" }}>
          <Link href={getProfilePageUrl({ username: data.username })} passHref>
            <a onClick={props.onUsernameClick}>@{data.username}</a>
          </Link>
          <Flex css={{ flexDirection: "column" }}>
            <UserStat>{formatStat(data.followers.count)} followers</UserStat>
            <UserStat>{formatStat(data.follows.count)} following</UserStat>
          </Flex>
        </Flex>
      )}
    </>
  );
};

const UserStatsPlaceholder = styled("div", { alignSelf: "center", width: "$11" });

const UserStat = styled(Subtext, { whiteSace: "nowrap" });
