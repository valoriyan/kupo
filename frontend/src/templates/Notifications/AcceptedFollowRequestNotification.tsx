import Link from "next/link";
import { RenderableAcceptedUserFollowRequestNotification } from "#/api";
import { Avatar } from "#/components/Avatar";
import { Stack } from "#/components/Layout";
import { Body } from "#/components/Typography";
import { UserName } from "#/components/UserName";
import {
  goToUserProfilePage,
  setPreviousLocationForUserProfilePage,
} from "../UserProfile";
import { NotificationWrapper } from "./shared";
import { Button } from "#/components/Button";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";
import { getShortRelativeTimestamp } from "#/utils/getRelativeTimestamp";

export interface AcceptedFollowRequestNotificationProps {
  notification: RenderableAcceptedUserFollowRequestNotification;
}

export const AcceptedFollowRequestNotification = ({
  notification,
}: AcceptedFollowRequestNotificationProps) => {
  const {
    userAcceptingFollowRequest: { username, profilePictureTemporaryUrl },
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
          <UserName username={username} /> accepted your follower request.
        </Body>
        <Body css={{ color: "$secondaryText", fontStyle: "italic" }}>
          {getShortRelativeTimestamp(eventTimestamp)} ago
        </Body>
      </Stack>

      <Link href={getProfilePageUrl({ username })} passHref>
        <Button
          as="a"
          size="sm"
          onClick={() => setPreviousLocationForUserProfilePage(username)}
        >
          View Profile
        </Button>
      </Link>
    </NotificationWrapper>
  );
};
