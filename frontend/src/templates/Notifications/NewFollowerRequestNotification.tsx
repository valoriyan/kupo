import Link from "next/link";
import { RenderableNewUserFollowRequestNotification } from "#/api";
import { Avatar } from "#/components/Avatar";
import { Button } from "#/components/Button";
import { Stack } from "#/components/Layout";
import { Body } from "#/components/Typography";
import { UserName } from "#/components/UserName";
import { getShortRelativeTimestamp } from "#/utils/getRelativeTimestamp";
import { goToUserProfilePage } from "../UserProfile";
import { NotificationWrapper } from "./shared";
import { setPreviousLocationForMyLists } from "#/pages/my-lists";

export interface NewFollowerRequestNotificationProps {
  notification: RenderableNewUserFollowRequestNotification;
}

export const NewFollowerRequestNotification = ({
  notification,
}: NewFollowerRequestNotificationProps) => {
  const {
    followRequestingUser: { username, profilePictureTemporaryUrl },
    eventTimestamp,
  } = notification;

  return (
    <NotificationWrapper>
      <Avatar
        alt={`@${username}'s profile picture`}
        src={profilePictureTemporaryUrl}
        size="$8"
        onClick={() => goToUserProfilePage(username)}
      />

      <Stack css={{ gap: "$2" }}>
        <Body>
          <UserName username={username} /> requested to follow you.
        </Body>
        <Body css={{ color: "$secondaryText", fontStyle: "italic" }}>
          {getShortRelativeTimestamp(eventTimestamp)} ago
        </Body>
      </Stack>

      <Link href="/my-lists/follower-requests" passHref>
        <Button as="a" size="sm" onClick={setPreviousLocationForMyLists}>
          View Request
        </Button>
      </Link>
    </NotificationWrapper>
  );
};
