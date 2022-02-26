import { RenderableNewLikeOnPostNotification } from "#/api";
import { Avatar } from "#/components/Avatar";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";
import Link from "next/link";

export const NewLikeOnPostNotification = ({
  notification,
}: {
  notification: RenderableNewLikeOnPostNotification;
}) => {
  const {
    userThatLikedPost: { username, profilePictureTemporaryUrl },
    // post,
    timestampSeenByUser,
  } = notification;

  return (
    <div>
      <Avatar
        alt={`@${username}'s profile picture`}
        src={profilePictureTemporaryUrl}
        size="$7"
      />

      <span>
        <Link href={getProfilePageUrl({ username })}>{username}</Link> liked your post.
      </span>

      <span>{timestampSeenByUser}</span>
    </div>
  );
};
