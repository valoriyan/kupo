import { RenderablePost } from "#/api";
import { RenderableNewTagInPublishedItemCommentNotification } from "#/api/generated/types/renderable-new-tag-in-published-item-comment-notification";
import { Avatar } from "#/components/Avatar";
import { Stack } from "#/components/Layout";
import { PostThumbnail } from "#/components/PostThumbnail";
import { Body } from "#/components/Typography";
import { UserName } from "#/components/UserName";
import { getShortRelativeTimestamp } from "#/utils/getRelativeTimestamp";
import { truncate } from "#/utils/truncate";
import { goToUserProfilePage } from "../../UserProfile";
import { NotificationWrapper } from "../shared";

export interface NewTagInPublishedItemCommentProps {
  notification: RenderableNewTagInPublishedItemCommentNotification;
}

export const NewTagInPublishedItemComment = ({
  notification,
}: NewTagInPublishedItemCommentProps) => {
  const {
    userTaggingClient: { username, profilePictureTemporaryUrl },
    publishedItem,
    publishedItemComment: { text: postCommentText },
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
          <UserName username={username} /> tagged you in a comment{" "}
          <em>
            &ldquo;
            {truncate(postCommentText, 60)}
            &rdquo;
          </em>
        </Body>
        <Body css={{ color: "$secondaryText", fontStyle: "italic" }}>
          {getShortRelativeTimestamp(eventTimestamp)} ago
        </Body>
      </Stack>

      <PostThumbnail post={publishedItem as unknown as RenderablePost} />
    </NotificationWrapper>
  );
};
