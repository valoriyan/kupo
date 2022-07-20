import {
  NOTIFICATIONEVENTS,
  RenderableNewCommentOnPublishedItemNotification,
  RenderableNewFollowerNotification,
  RenderableNewLikeOnPublishedItemNotification,
  RenderableUserNotification,
} from "#/api";
import { NewCommentOnPublishedItemNotification } from "./NewCommentOnPublishedItemNotification";
import { NewFollowerNotification } from "./NewFollowerNotification";
import { NewLikeOnPublishedItemNotification } from "./NewLikeOnPublishedItemNotification";
import { NewTagInPublishedItemCommentNotification } from "./NewTagInPublishedItemCommentNotification";

export interface NotificationProps {
  notification: RenderableUserNotification;
}

export const Notification = ({ notification }: NotificationProps) => {
  const { type } = notification;

  console.log(notification);

  if ((type as unknown as NOTIFICATIONEVENTS) === NOTIFICATIONEVENTS.NewFollower) {
    return (
      <NewFollowerNotification
        notification={notification as unknown as RenderableNewFollowerNotification}
      />
    );
  } else if (
    (type as unknown as NOTIFICATIONEVENTS) ===
    NOTIFICATIONEVENTS.NewCommentOnPublishedItem
  ) {
    return (
      <NewCommentOnPublishedItemNotification
        notification={
          notification as unknown as RenderableNewCommentOnPublishedItemNotification
        }
      />
    );
  } else if (
    (type as unknown as NOTIFICATIONEVENTS) === NOTIFICATIONEVENTS.NewLikeOnPublishedItem
  ) {
    return (
      <NewLikeOnPublishedItemNotification
        notification={
          notification as unknown as RenderableNewLikeOnPublishedItemNotification
        }
      />
    );
  } else if (
    (type as unknown as NOTIFICATIONEVENTS) ===
    NOTIFICATIONEVENTS.NewTagInPublishedItemComment
  ) {
    return <NewTagInPublishedItemCommentNotification notification={notification} />;
  } else {
    return null;
  }
};
