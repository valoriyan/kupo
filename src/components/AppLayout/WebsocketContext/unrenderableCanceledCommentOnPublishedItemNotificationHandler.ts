import { GetState, SetState } from "zustand";
import {
  NOTIFICATIONEVENTS,
  RenderableUserNotification,
  UnrenderableCanceledCommentOnPublishedItemNotification,
} from "#/api";
import { WebsocketState } from ".";

export const generateUnrenderableCanceledCommentOnPublishedItemNotificationHandler =
  ({ set, get }: { set: SetState<WebsocketState>; get: GetState<WebsocketState> }) =>
  (
    unrenderableCanceledCommentOnPublishedItemNotification: UnrenderableCanceledCommentOnPublishedItemNotification,
  ) => {
    const { countOfUnreadNotifications, publishedItemCommentId } =
      unrenderableCanceledCommentOnPublishedItemNotification;

    const { notificationsReceived } = get();
    const updatedNotificationsReceived: RenderableUserNotification[] = [];

    notificationsReceived.forEach((notificationReceived) => {
      const isCancelledNotification =
        (notificationReceived.type as unknown as NOTIFICATIONEVENTS) ===
          NOTIFICATIONEVENTS.NewCommentOnPublishedItem &&
        notificationReceived.publishedItemComment.publishedItemCommentId ===
          publishedItemCommentId;

      if (!isCancelledNotification) {
        updatedNotificationsReceived.push(notificationReceived);
      }
    });

    set({
      updatedCountOfUnreadNotifications: countOfUnreadNotifications,
      notificationsReceived: updatedNotificationsReceived,
    });
  };
