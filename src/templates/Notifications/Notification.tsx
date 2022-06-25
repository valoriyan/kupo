import {
  NOTIFICATIONEVENTS,
  RenderableNewCommentOnPostNotification,
  RenderableNewFollowerNotification,
  RenderableNewLikeOnPostNotification,
  RenderableUserNotification,
} from "#/api";
import { NewCommentOnPostNotification } from "./NewCommentOnPostNotification";
import { NewFollowerNotification } from "./NewFollowerNotification";
import { NewLikeOnPostNotification } from "./NewLikeOnPostNotification";
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
    (type as unknown as NOTIFICATIONEVENTS) === NOTIFICATIONEVENTS.NewCommentOnPost
  ) {
    return (
      <NewCommentOnPostNotification
        notification={notification as unknown as RenderableNewCommentOnPostNotification}
      />
    );
  } else if (
    (type as unknown as NOTIFICATIONEVENTS) === NOTIFICATIONEVENTS.NewLikeOnPost
  ) {
    return (
      <NewLikeOnPostNotification
        notification={notification as unknown as RenderableNewLikeOnPostNotification}
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
