import { MouseEvent } from "react";
import { UserFollowingStatus } from "#/api";
import { useFollowUser } from "#/api/mutations/users/followUser";
import { useUnfollowUser } from "#/api/mutations/users/unfollowUser";
import { Button } from "#/components/Button";

export interface FollowButtonProps {
  userId: string;
  username: string;
  isUserPrivate: boolean;
  followingStatus: UserFollowingStatus;
}

export const FollowButton = ({
  userId,
  username,
  isUserPrivate,
  followingStatus,
}: FollowButtonProps) => {
  const { mutateAsync: followUser } = useFollowUser({
    userIdBeingFollowed: userId,
    usernameBeingFollowed: username,
    isUserPrivate,
  });

  const { mutateAsync: unfollowUser } = useUnfollowUser({
    userIdBeingUnfollowed: userId,
    usernameBeingUnfollowed: username,
  });

  const isFollowing = followingStatus === UserFollowingStatus.IsFollowing;
  const isPending = followingStatus === UserFollowingStatus.Pending;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (isFollowing) unfollowUser();
    else followUser();
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
