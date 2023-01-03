import { useGetClientUserProfile } from "#/api/queries/users/useGetClientUserProfile";
import { styled } from "#/styling";
import { goToUserProfilePage } from "#/templates/UserProfile";
import { formatStat } from "#/utils/formatStat";
import { Avatar } from "../Avatar";
import { Flex } from "../Layout";
import { LoadingArea } from "../LoadingArea";
import { Subtext } from "../Typography";
import { UserName } from "../UserName";

export interface UserInfoProps {
  onUsernameClick?: () => void;
}

export const UserInfo = (props: UserInfoProps) => {
  const { data, isLoading } = useGetClientUserProfile();

  return (
    <>
      <Avatar
        alt="User Avatar"
        src={data?.profilePictureTemporaryUrl}
        onClick={data?.username ? () => goToUserProfilePage(data.username) : undefined}
      />
      {isLoading || !data ? (
        <UserStatsPlaceholder>
          <LoadingArea size="md" />
        </UserStatsPlaceholder>
      ) : (
        <Flex css={{ gap: "$3", flexDirection: "column" }}>
          <UserName username={data.username} onClick={props.onUsernameClick} />
          <Flex css={{ flexDirection: "column" }}>
            <UserStat>{formatStat(data.followers.count)} followers</UserStat>
            <UserStat>{formatStat(data.follows.count)} following</UserStat>
          </Flex>
        </Flex>
      )}
    </>
  );
};

const UserStatsPlaceholder = styled("div", { alignSelf: "center", width: "$10" });

const UserStat = styled(Subtext, { whiteSace: "nowrap", color: "$secondaryText" });
