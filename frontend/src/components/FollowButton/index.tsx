import { MouseEvent } from "react";
import { FollowingStatus } from "#/api";
import { useFollowUser } from "#/api/mutations/users/followUser";
import { useUnfollowUser } from "#/api/mutations/users/unfollowUser";
import { Button } from "#/components/Button";
import { useFollowCommunity } from "#/api/mutations/community/followCommunity";
import { useUnfollowCommunity } from "#/api/mutations/community/unfollowCommunity";

export interface FollowUserButtonProps {
  userId: string;
  username: string;
  isUserPrivate: boolean;
  followingStatus: FollowingStatus;
}

export const FollowUserButton = ({
  userId,
  username,
  isUserPrivate,
  followingStatus,
}: FollowUserButtonProps) => {
  const { mutateAsync: followUser } = useFollowUser({
    userIdBeingFollowed: userId,
    usernameBeingFollowed: username,
    isUserPrivate,
  });

  const { mutateAsync: unfollowUser } = useUnfollowUser({
    userIdBeingUnfollowed: userId,
    usernameBeingUnfollowed: username,
  });

  return (
    <FollowButton
      followingStatus={followingStatus}
      follow={followUser}
      unfollow={unfollowUser}
    />
  );
};

export interface FollowCommunityButtonProps {
  communityId: string;
  communityName: string;
  followingStatus: FollowingStatus;
}

export const FollowCommunityButton = ({
  communityId,
  communityName,
  followingStatus,
}: FollowCommunityButtonProps) => {
  const { mutateAsync: followCommunity } = useFollowCommunity({
    communityIdBeingFollowed: communityId,
    communityNameBeingFollowed: communityName,
  });

  const { mutateAsync: unfollowCommunity } = useUnfollowCommunity({
    communityIdBeingUnfollowed: communityId,
    communityNameBeingUnfollowed: communityName,
  });

  return (
    <FollowButton
      followingStatus={followingStatus}
      follow={followCommunity}
      unfollow={unfollowCommunity}
    />
  );
};

interface FollowButtonProps {
  followingStatus: FollowingStatus;
  follow: () => Promise<unknown>;
  unfollow: () => Promise<unknown>;
}

const FollowButton = ({ followingStatus, follow, unfollow }: FollowButtonProps) => {
  const isFollowing = followingStatus === FollowingStatus.IsFollowing;
  const isPending = followingStatus === FollowingStatus.Pending;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (isFollowing) unfollow();
    else follow();
  }

  return (
    <Button
      onClick={handleClick}
      size="sm"
      variant="primary"
      outlined={isFollowing}
      disabled={isPending}
      css={{ width: "88px" }} // Width of Unfollow button
      data-cy={isFollowing ? "unfollow-button" : "follow-button"}
    >
      {isPending ? "Pending" : isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};
