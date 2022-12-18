import { RenderableNewLikeOnPublishedItemNotification, RenderablePost } from "#/api";
import { Avatar } from "#/components/Avatar";
import { Stack } from "#/components/Layout";
import { PostThumbnail } from "#/components/PostThumbnail";
import { Body } from "#/components/Typography";
import { UserName } from "#/components/UserName";
import { getShortRelativeTimestamp } from "#/utils/getRelativeTimestamp";
import { goToUserProfilePage } from "../../UserProfile";
import { NotificationWrapper } from "../shared";

export interface NewLikeOnPublishedItemProps {
  notification: RenderableNewLikeOnPublishedItemNotification;
}

export const NewLikeOnPublishedItem = ({ notification }: NewLikeOnPublishedItemProps) => {
  const {
    userThatLikedPublishedItem: { username, profilePictureTemporaryUrl },
    publishedItem,
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
          <UserName username={username} /> liked your post.
        </Body>
        <Body css={{ color: "$secondaryText", fontStyle: "italic" }}>
          {getShortRelativeTimestamp(eventTimestamp)} ago
        </Body>
      </Stack>

      <PostThumbnail post={publishedItem as unknown as RenderablePost} />
    </NotificationWrapper>
  );
};
