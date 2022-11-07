import {
  NOTIFICATIONEVENTS,
  RenderableAcceptedUserFollowRequestNotification,
  RenderableNewCommentOnPublishedItemNotification,
  RenderableNewFollowerNotification,
  RenderableNewLikeOnPublishedItemNotification,
  RenderableNewTagInPublishedItemCommentNotification,
  RenderableNewUserFollowRequestNotification,
  RenderableUserNotification,
} from "#/api";
import { AcceptedFollowRequestNotification } from "./AcceptedFollowRequestNotification";
import { NewCommentOnPublishedItemNotification } from "./NewCommentOnPublishedItemNotification";
import { NewFollowerNotification } from "./NewFollowerNotification";
import { NewFollowerRequestNotification } from "./NewFollowerRequestNotification";
import { NewLikeOnPublishedItemNotification } from "./NewLikeOnPublishedItemNotification";
import { NewTagInPublishedItemCommentNotification } from "./NewTagInPublishedItemCommentNotification";

export interface NotificationProps {
  notification: RenderableUserNotification;
}

export const Notification = ({ notification }: NotificationProps) => {
  const type = notification.type as unknown as NOTIFICATIONEVENTS;

  if (type === NOTIFICATIONEVENTS.NewFollower) {
    return (
      <NewFollowerNotification
        notification={notification as unknown as RenderableNewFollowerNotification}
      />
    );
  }

  if (type === NOTIFICATIONEVENTS.NewUserFollowRequest) {
    return (
      <NewFollowerRequestNotification
        notification={
          notification as unknown as RenderableNewUserFollowRequestNotification
        }
      />
    );
  }

  if (type === NOTIFICATIONEVENTS.AcceptedUserFollowRequest) {
    return (
      <AcceptedFollowRequestNotification
        notification={
          notification as unknown as RenderableAcceptedUserFollowRequestNotification
        }
      />
    );
  }

  if (type === NOTIFICATIONEVENTS.NewCommentOnPublishedItem) {
    return (
      <NewCommentOnPublishedItemNotification
        notification={
          notification as unknown as RenderableNewCommentOnPublishedItemNotification
        }
      />
    );
  }

  if (type === NOTIFICATIONEVENTS.NewLikeOnPublishedItem) {
    return (
      <NewLikeOnPublishedItemNotification
        notification={
          notification as unknown as RenderableNewLikeOnPublishedItemNotification
        }
      />
    );
  }

  if (type === NOTIFICATIONEVENTS.NewTagInPublishedItemComment) {
    return (
      <NewTagInPublishedItemCommentNotification
        notification={
          notification as unknown as RenderableNewTagInPublishedItemCommentNotification
        }
      />
    );
  }

  return null;
};
