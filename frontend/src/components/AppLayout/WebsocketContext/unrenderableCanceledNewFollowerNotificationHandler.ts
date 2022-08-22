import { GetState, SetState } from "zustand";
import {
  NOTIFICATIONEVENTS,
  RenderableUserNotification,
  UnrenderableCanceledNewFollowerNotification,
} from "#/api";
import { WebsocketState } from ".";

export const generateUnrenderableCanceledNewFollowerNotificationHandler =
  ({ set, get }: { set: SetState<WebsocketState>; get: GetState<WebsocketState> }) =>
  (
    unrenderableCanceledNewFollowerNotification: UnrenderableCanceledNewFollowerNotification,
  ) => {
    const { countOfUnreadNotifications, userIdDoingUnfollowing } =
      unrenderableCanceledNewFollowerNotification;

    const { notificationsReceived } = get();
    const updatedNotificationsReceived: RenderableUserNotification[] = [];

    notificationsReceived.forEach((notificationReceived) => {
      const isCancelledNotification =
        (notificationReceived.type as unknown as NOTIFICATIONEVENTS) ===
          NOTIFICATIONEVENTS.NewFollower &&
        notificationReceived.userDoingFollowing.userId === userIdDoingUnfollowing;

      if (!isCancelledNotification) {
        updatedNotificationsReceived.push(notificationReceived);
      }
    });

    set({
      updatedCountOfUnreadNotifications: countOfUnreadNotifications,
      notificationsReceived: updatedNotificationsReceived,
    });
  };
