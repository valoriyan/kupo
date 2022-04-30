import { MouseEvent } from "react";
import { useFollowUser } from "#/api/mutations/users/followUser";
import { useUnfollowUser } from "#/api/mutations/users/unfollowUser";
import { Button } from "#/components/Button";

export const FollowButton = ({
  userId,
  username,
  isBeingFollowedByClient,
}: {
  userId: string;
  username: string;
  isBeingFollowedByClient: boolean;
}) => {
  const { mutateAsync: followUser } = useFollowUser({
    userIdBeingFollowed: userId,
    usernameBeingFollowed: username,
  });

  const { mutateAsync: unfollowUser } = useUnfollowUser({
    userIdBeingUnfollowed: userId,
    usernameBeingUnfollowed: username,
  });

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (isBeingFollowedByClient) {
      unfollowUser();
    } else {
      followUser();
    }
  }

  return (
    <Button
      onClick={handleClick}
      size="sm"
      variant="primary"
      outlined={isBeingFollowedByClient}
      css={{ width: "88px" }} // Width of Unfollow button
    >
      {isBeingFollowedByClient ? "Unfollow" : "Follow"}
    </Button>
  );
};
