import Link from "next/link";
import { RenderableNewFollowerNotification } from "#/api";
import { Avatar } from "#/components/Avatar";
import { Button } from "#/components/Button";
import { Stack } from "#/components/Layout";
import { Body } from "#/components/Typography";
import { UserName } from "#/components/UserName";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";
import { getShortRelativeTimestamp } from "#/utils/getRelativeTimestamp";
import {
  goToUserProfilePage,
  setPreviousLocationForUserProfilePage,
} from "../../UserProfile";
import { NotificationWrapper } from "../shared";

export interface NewFollowerProps {
  notification: RenderableNewFollowerNotification;
}

export const NewFollower = ({ notification }: NewFollowerProps) => {
  const {
    userDoingFollowing: { username, profilePictureTemporaryUrl },
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
          <UserName username={username} /> followed you.
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
