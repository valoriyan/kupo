import { GetState, SetState } from "zustand";
import {
  NOTIFICATIONEVENTS,
  RenderableNewCommentOnPublishedItemNotification,
  RenderableUserNotification,
  UnrenderableCanceledCommentOnPublishedItemNotification,
} from "#/api";
import { WebsocketState } from ".";

export const getNewCommentOnPublishedItemNotificationHandler =
  ({ set, get }: { set: SetState<WebsocketState>; get: GetState<WebsocketState> }) =>
  (
    renderableNewCommentOnPublishedItemNotification: RenderableNewCommentOnPublishedItemNotification,
  ) => {
    const { notificationsReceived } = get();

    set({
      updatedCountOfUnreadNotifications:
        renderableNewCommentOnPublishedItemNotification.countOfUnreadNotifications,
      notificationsReceived: [
        ...notificationsReceived,
        renderableNewCommentOnPublishedItemNotification as unknown as RenderableUserNotification,
      ],
    });
  };

export const getCanceledCommentOnPublishedItemNotificationHandler =
  ({ set, get }: { set: SetState<WebsocketState>; get: GetState<WebsocketState> }) =>
  (
    unrenderableCanceledCommentOnPublishedItemNotification: UnrenderableCanceledCommentOnPublishedItemNotification,
  ) => {
    const { countOfUnreadNotifications, publishedItemCommentId } =
      unrenderableCanceledCommentOnPublishedItemNotification;

    const { notificationsReceived } = get();

    const filteredNotifications = notificationsReceived.filter(
      (notification) =>
        !(
          (notification.type as unknown as NOTIFICATIONEVENTS) ===
            NOTIFICATIONEVENTS.NewCommentOnPublishedItem &&
          notification.publishedItemComment.publishedItemCommentId ===
            publishedItemCommentId
        ),
    );

    set({
      updatedCountOfUnreadNotifications: countOfUnreadNotifications,
      notificationsReceived: filteredNotifications,
    });
  };
