import Router from "next/router";
import { ProfilePrivacySetting, RenderableUser, UserFollowingStatus } from "#/api";
import { useFollowUser } from "#/api/mutations/users/followUser";
import { useUnfollowUser } from "#/api/mutations/users/unfollowUser";
import { Avatar } from "#/components/Avatar";
import { Button } from "#/components/Button";
import { Flex } from "#/components/Layout";
import { TextOrSpinner } from "#/components/TextOrSpinner";
import { UserName } from "#/components/UserName";
import { styled } from "#/styling";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";

export interface ListUserProps {
  user: RenderableUser;
  additionalActions?: Array<{
    variant: "primary" | "secondary" | "danger";
    label: string;
    onClick: () => void;
    isLoading: boolean;
    isDisabled: boolean;
  }>;
}

export const ListUser = ({ user, additionalActions }: ListUserProps) => {
  const profilePageUrl = getProfilePageUrl({ username: user.username });

  const { mutateAsync: followUser, isLoading: isFollowing } = useFollowUser({
    userIdBeingFollowed: user.userId,
    usernameBeingFollowed: user.username,
    isUserPrivate: user.profilePrivacySetting === ProfilePrivacySetting.Private,
  });

  const { mutateAsync: unfollowUser, isLoading: isUnfollowing } = useUnfollowUser({
    userIdBeingUnfollowed: user.userId,
    usernameBeingUnfollowed: user.username,
  });

  const toggleFollow = () => {
    if (user.followingStatusOfClientToUser === UserFollowingStatus.IsFollowing) {
      unfollowUser();
    } else followUser();
  };

  return (
    <Wrapper>
      <Flex css={{ gap: "$4", alignItems: "center" }}>
        <Avatar
          alt={`@${user.username}'s profile picture`}
          src={user.profilePictureTemporaryUrl}
          size="$8"
          onClick={() => Router.push(profilePageUrl)}
        />
        <UserName username={user.username} />
      </Flex>
      <Flex css={{ gap: "$6" }}>
        <Button
          size="sm"
          outlined
          variant={
            user.followingStatusOfClientToUser === UserFollowingStatus.IsFollowing
              ? "secondary"
              : "primary"
          }
          onClick={toggleFollow}
          disabled={isFollowing || isUnfollowing}
        >
          <TextOrSpinner isLoading={isFollowing || isUnfollowing}>
            {user.followingStatusOfClientToUser === UserFollowingStatus.IsFollowing
              ? "Unfollow"
              : user.followingStatusOfClientToUser === UserFollowingStatus.Pending
              ? "Pending"
              : "Follow"}
          </TextOrSpinner>
        </Button>
        {additionalActions && (
          <Flex css={{ gap: "$3" }}>
            {additionalActions.map((action) => (
              <Button
                key={action.label}
                size="sm"
                variant={action.variant}
                onClick={action.onClick}
                disabled={action.isDisabled || action.isLoading}
              >
                <TextOrSpinner isLoading={action.isLoading}>{action.label}</TextOrSpinner>
              </Button>
            ))}
          </Flex>
        )}
      </Flex>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  display: "flex",
  px: "$5",
  py: "$4",
  gap: "$4",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "solid $borderWidths$1 $border",
});
