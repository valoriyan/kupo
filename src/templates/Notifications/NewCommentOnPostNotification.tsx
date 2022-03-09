import Link from "next/link";
import { RenderableNewCommentOnPostNotification } from "#/api";
import { Avatar } from "#/components/Avatar";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";
import { Grid, Stack } from "#/components/Layout";
import { Body } from "#/components/Typography";
import { Button } from "#/components/Button";
import { getShortRelativeTimestamp } from "#/utils/getRelativeTimestamp";

export const NewCommentOnPostNotification = ({
  notification,
}: {
  notification: RenderableNewCommentOnPostNotification;
}) => {
  const {
    userThatCommented: { username, profilePictureTemporaryUrl },
    // post,
    postComment: { text: postCommentText },
    eventTimestamp,
  } = notification;

  return (
    <Grid
      css={{
        px: "$5",
        py: "$4",
        gridTemplateColumns: "auto minmax(0, 1fr) auto",
        columnGap: "$4",
        borderBottom: "solid $borderWidths$1 $border",
      }}
    >
      <Avatar
        alt={`@${username}'s profile picture`}
        src={profilePictureTemporaryUrl}
        size="$8"
      />

      <Stack css={{ gap: "$1" }}>
        <Body>
          <Link href={getProfilePageUrl({ username })}>{username}</Link> commented &ldquo;
          {postCommentText}&rdquo; on your post.
        </Body>
        <Body css={{ color: "$secondaryText", fontStyle: "italic" }}>
          {getShortRelativeTimestamp(eventTimestamp)} ago
        </Body>
      </Stack>

      <Link href={getProfilePageUrl({ username })} passHref>
        <Button as="a" size="sm">
          View Profile
        </Button>
      </Link>
    </Grid>
  );
};
