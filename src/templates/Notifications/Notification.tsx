import { NOTIFICATIONEVENTS, RenderableUserNotification } from "#/api";
import { NewCommentOnPostNotification } from "./NewCommentOnPostNotification";
import { NewFollowerNotification } from "./NewFollowerNotification";
import { NewLikeOnPostNotification } from "./NewLikeOnPostNotification";

export interface NotificationProps {
  notification: RenderableUserNotification;
}

export const Notification = ({ notification }: NotificationProps) => {
  const { type } = notification;

  if (type === NOTIFICATIONEVENTS.NewFollower) {
    return <NewFollowerNotification notification={notification} />;
  } else if (type === NOTIFICATIONEVENTS.NewCommentOnPost) {
    return <NewCommentOnPostNotification notification={notification} />;
  } else if (type === NOTIFICATIONEVENTS.NewLikeOnPost) {
    return <NewLikeOnPostNotification notification={notification} />;
  } else {
    return null;
  }
};
