import { GetState, SetState } from "zustand";
import {
  NOTIFICATIONEVENTS,
  RenderableNewFollowerNotification,
  RenderableUserNotification,
  UnrenderableCanceledNewFollowerNotification,
} from "#/api";
import { WebsocketState } from ".";

export const getNewFollowerNotificationHandler =
  ({ set, get }: { set: SetState<WebsocketState>; get: GetState<WebsocketState> }) =>
  (renderableNewFollowerNotification: RenderableNewFollowerNotification) => {
    const { notificationsReceived } = get();

    set({
      updatedCountOfUnreadNotifications:
        renderableNewFollowerNotification.countOfUnreadNotifications,
      notificationsReceived: [
        ...notificationsReceived,
        renderableNewFollowerNotification as unknown as RenderableUserNotification,
      ],
    });
  };

export const getCanceledNewFollowerNotificationHandler =
  ({ set, get }: { set: SetState<WebsocketState>; get: GetState<WebsocketState> }) =>
  (
    unrenderableCanceledNewFollowerNotification: UnrenderableCanceledNewFollowerNotification,
  ) => {
    const { countOfUnreadNotifications, userIdDoingUnfollowing } =
      unrenderableCanceledNewFollowerNotification;

    const { notificationsReceived } = get();

    const filteredNotifications = notificationsReceived.filter(
      (notification) =>
        !(
          (notification.type as unknown as NOTIFICATIONEVENTS) ===
            NOTIFICATIONEVENTS.NewFollower &&
          notification.userDoingFollowing.userId === userIdDoingUnfollowing
        ),
    );

    set({
      updatedCountOfUnreadNotifications: countOfUnreadNotifications,
      notificationsReceived: filteredNotifications,
    });
  };
