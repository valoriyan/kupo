import Router from "next/router";
import { RenderableNewCommentOnPostNotification } from "#/api";
import { Avatar } from "#/components/Avatar";
import { Stack } from "#/components/Layout";
import { PostThumbnail } from "#/components/PostThumbnail";
import { Body } from "#/components/Typography";
import { UserName } from "#/components/UserName";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";
import { getShortRelativeTimestamp } from "#/utils/getRelativeTimestamp";
import { truncate } from "#/utils/truncate";
import { NotificationWrapper } from "./shared";

export const NewCommentOnPostNotification = ({
  notification,
}: {
  notification: RenderableNewCommentOnPostNotification;
}) => {
  const {
    userThatCommented: { username, profilePictureTemporaryUrl },
    postComment: { text: postCommentText },
    post,
    eventTimestamp,
  } = notification;

  return (
    <NotificationWrapper>
      <Avatar
        alt={`@${username}'s profile picture`}
        src={profilePictureTemporaryUrl}
        size="$8"
        onClick={() => Router.push(getProfilePageUrl({ username }))}
      />

      <Stack css={{ gap: "$2" }}>
        <Body>
          <UserName username={username} /> commented{" "}
          <em>
            &ldquo;
            {truncate(postCommentText, 60)}
            &rdquo;
          </em>{" "}
          on your post.
        </Body>
        <Body css={{ color: "$secondaryText", fontStyle: "italic" }}>
          {getShortRelativeTimestamp(eventTimestamp)} ago
        </Body>
      </Stack>

      <PostThumbnail post={post} />
    </NotificationWrapper>
  );
};
