import { GetState, SetState } from "zustand";
import {
  NOTIFICATIONEVENTS,
  RenderableUserNotification,
  UnrenderableCanceledCommentOnPostNotification,
} from "#/api";
import { WebsocketState } from ".";

export const generateUnrenderableCanceledCommentOnPostNotificationHandler =
  ({ set, get }: { set: SetState<WebsocketState>; get: GetState<WebsocketState> }) =>
  (
    unrenderableCanceledCommentOnPostNotification: UnrenderableCanceledCommentOnPostNotification,
  ) => {
    const { countOfUnreadNotifications, postCommentId } =
      unrenderableCanceledCommentOnPostNotification;

    const { notificationsReceived } = get();
    const updatedNotificationsReceived: RenderableUserNotification[] = [];

    notificationsReceived.forEach((notificationReceived) => {
      const isCancelledNotification =
        (notificationReceived.type as unknown as NOTIFICATIONEVENTS) ===
          NOTIFICATIONEVENTS.NewCommentOnPost &&
        notificationReceived.postComment.postCommentId === postCommentId;

      if (!isCancelledNotification) {
        updatedNotificationsReceived.push(notificationReceived);
      }
    });

    set({
      updatedCountOfUnreadNotifications: countOfUnreadNotifications,
      notificationsReceived: updatedNotificationsReceived,
    });
  };
