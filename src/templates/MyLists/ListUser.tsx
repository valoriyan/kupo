import Router from "next/router";
import { RenderableUser } from "#/api";
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
}

export const ListUser = ({ user }: ListUserProps) => {
  const profilePageUrl = getProfilePageUrl({ username: user.username });

  const { mutateAsync: followUser, isLoading: isFollowing } = useFollowUser({
    userIdBeingFollowed: user.userId,
    usernameBeingFollowed: user.username,
  });

  const { mutateAsync: unfollowUser, isLoading: isUnfollowing } = useUnfollowUser({
    userIdBeingUnfollowed: user.userId,
    usernameBeingUnfollowed: user.username,
  });

  const toggleFollow = () => {
    if (user.isBeingFollowedByClient) unfollowUser();
    else followUser();
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
      <Button size="sm" onClick={toggleFollow} disabled={isFollowing || isUnfollowing}>
        <TextOrSpinner isLoading={isFollowing || isUnfollowing}>
          {user.isBeingFollowedByClient ? "Unfollow" : "Follow"}
        </TextOrSpinner>
      </Button>
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
