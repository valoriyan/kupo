import { RenderableNewFollowerNotification } from "#/api";
import { Avatar } from "#/components/Avatar";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";
import Link from "next/link";

export const NewFollowerNotification = ({
  notification,
}: {
  notification: RenderableNewFollowerNotification;
}) => {
  const {
    userDoingFollowing: { username, profilePictureTemporaryUrl },
    timestampSeenByUser,
  } = notification;

  return (
    <div>
      <Avatar
        alt={`@${username}'s profile picture`}
        src={profilePictureTemporaryUrl}
        size="$7"
      />

      <div>
        <Link href={getProfilePageUrl({ username })}>{username}</Link> followed you.
      </div>

      <span>{timestampSeenByUser}</span>
    </div>
  );
};
