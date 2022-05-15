import { GetState, SetState } from "zustand";
import {
  NOTIFICATIONEVENTS,
  RenderableUserNotification,
  UnrenderableCanceledNewLikeOnPostNotification,
} from "#/api";
import { WebsocketState } from ".";

export const generateUnrenderableCanceledNewLikeOnPostNotificationHandler =
  ({ set, get }: { set: SetState<WebsocketState>; get: GetState<WebsocketState> }) =>
  (
    unrenderableCanceledNewLikeOnPostNotification: UnrenderableCanceledNewLikeOnPostNotification,
  ) => {
    const { countOfUnreadNotifications, userIdUnlikingPost, postId } =
      unrenderableCanceledNewLikeOnPostNotification;

    const { notificationsReceived } = get();
    const updatedNotificationsReceived: RenderableUserNotification[] = [];

    notificationsReceived.forEach((notificationReceived) => {
      const isCancelledNotification =
        notificationReceived.type === NOTIFICATIONEVENTS.NewLikeOnPost &&
        notificationReceived.userThatLikedPost.userId === userIdUnlikingPost &&
        notificationReceived.post.postId === postId;

      if (!isCancelledNotification) {
        updatedNotificationsReceived.push(notificationReceived);
      }
    });

    set({
      updatedCountOfUnreadNotifications: countOfUnreadNotifications,
      notificationsReceived: updatedNotificationsReceived,
    });
  };
