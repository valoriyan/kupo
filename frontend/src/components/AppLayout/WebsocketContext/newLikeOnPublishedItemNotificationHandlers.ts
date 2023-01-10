import { GetState, SetState } from "zustand";
import {
  NOTIFICATIONEVENTS,
  RenderableNewLikeOnPublishedItemNotification,
  RenderableUserNotification,
  UnrenderableCanceledNewLikeOnPublishedItemNotification,
} from "#/api";
import { WebsocketState } from ".";

export const getNewLikeOnPublishedItemNotificationHandler =
  ({ set, get }: { set: SetState<WebsocketState>; get: GetState<WebsocketState> }) =>
  (
    renderableNewLikeOnPublishedItemNotification: RenderableNewLikeOnPublishedItemNotification,
  ) => {
    const { notificationsReceived } = get();

    set({
      updatedCountOfUnreadNotifications:
        renderableNewLikeOnPublishedItemNotification.countOfUnreadNotifications,
      notificationsReceived: [
        ...notificationsReceived,
        renderableNewLikeOnPublishedItemNotification as unknown as RenderableUserNotification,
      ],
    });
  };

export const getCanceledNewLikeOnPublishedItemNotificationHandler =
  ({ set, get }: { set: SetState<WebsocketState>; get: GetState<WebsocketState> }) =>
  (
    unrenderableCanceledNewLikeOnPublishedItemNotification: UnrenderableCanceledNewLikeOnPublishedItemNotification,
  ) => {
    const { countOfUnreadNotifications, userIdUnlikingPublishedItem, publishedItemId } =
      unrenderableCanceledNewLikeOnPublishedItemNotification;

    const { notificationsReceived } = get();

    const filteredNotifications = notificationsReceived.filter(
      (notification) =>
        !(
          (notification.type as unknown as NOTIFICATIONEVENTS) ===
            NOTIFICATIONEVENTS.NewLikeOnPublishedItem &&
          notification.userThatLikedPublishedItem.userId ===
            userIdUnlikingPublishedItem &&
          notification.publishedItem.id === publishedItemId
        ),
    );

    set({
      updatedCountOfUnreadNotifications: countOfUnreadNotifications,
      notificationsReceived: filteredNotifications,
    });
  };
