import Link from "next/link";
import { useGetUserProfile } from "#/api/queries/users/useGetUserProfile";
import { styled } from "#/styling";
import { formatStat } from "#/utils/formatStat";
import { Avatar } from "../Avatar";
import { Flex } from "../Layout";
import { LoadingArea } from "../LoadingArea";
import { Subtext } from "../Typography";
import { generateUserProfilePageUrl } from "#/utils/generateLinkUrls";

export interface UserInfoProps {
  onUsernameClick?: () => void;
}

export const UserInfo = (props: UserInfoProps) => {
  const { data, isLoading } = useGetUserProfile({ isOwnProfile: true });

  return (
    <>
      <Avatar alt="User Avatar" src={data?.profilePictureTemporaryUrl} />
      {isLoading || !data ? (
        <UserStatsPlaceholder>
          <LoadingArea size="md" />
        </UserStatsPlaceholder>
      ) : (
        <Flex css={{ gap: "$2", flexDirection: "column" }}>
          <Link href={generateUserProfilePageUrl({ username: data.username })} passHref>
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
