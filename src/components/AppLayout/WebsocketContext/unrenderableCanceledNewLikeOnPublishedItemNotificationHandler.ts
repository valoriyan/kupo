import { GetState, SetState } from "zustand";
import {
  NOTIFICATIONEVENTS,
  RenderableUserNotification,
  UnrenderableCanceledNewLikeOnPublishedItemNotification,
} from "#/api";
import { WebsocketState } from ".";

export const generateUnrenderableCanceledNewLikeOnPublishedItemNotificationHandler =
  ({ set, get }: { set: SetState<WebsocketState>; get: GetState<WebsocketState> }) =>
  (
    unrenderableCanceledNewLikeOnPublishedItemNotification: UnrenderableCanceledNewLikeOnPublishedItemNotification,
  ) => {
    const { countOfUnreadNotifications, userIdUnlikingPost, publishedItemId } =
      unrenderableCanceledNewLikeOnPublishedItemNotification;

    const { notificationsReceived } = get();
    const updatedNotificationsReceived: RenderableUserNotification[] = [];

    notificationsReceived.forEach((notificationReceived) => {
      const isCancelledNotification =
        (notificationReceived.type as unknown as NOTIFICATIONEVENTS) ===
          NOTIFICATIONEVENTS.NewLikeOnPublishedItem &&
        notificationReceived.userThatLikedPublishedItem.userId === userIdUnlikingPost &&
        notificationReceived.publishedItem.id === publishedItemId;

      if (!isCancelledNotification) {
        updatedNotificationsReceived.push(notificationReceived);
      }
    });

    set({
      updatedCountOfUnreadNotifications: countOfUnreadNotifications,
      notificationsReceived: updatedNotificationsReceived,
    });
  };
