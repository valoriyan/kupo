import Link from "next/link";
import { RenderableNewCommentOnPostNotification } from "#/api";
import { Avatar } from "#/components/Avatar";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";

export const NewCommentOnPostNotification = ({
  notification,
}: {
  notification: RenderableNewCommentOnPostNotification;
}) => {
  const {
    userThatCommented: { username, profilePictureTemporaryUrl },
    // post,
    // postComment,
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
        <Link href={getProfilePageUrl({ username })}>{username}</Link> commented on your
        post.
      </div>

      <span>{timestampSeenByUser}</span>
    </div>
  );
};
