import { GetState, SetState } from "zustand";
import {
  RenderableNewLikeOnPublishedItemNotification,
  RenderableUserNotification,
} from "#/api";
import { WebsocketState } from ".";

export const generateRenderableNewLikeOnPublishedItemNotificationHandler =
  ({ set, get }: { set: SetState<WebsocketState>; get: GetState<WebsocketState> }) =>
  (
    renderableNewLikeOnPublishedItemNotification: RenderableNewLikeOnPublishedItemNotification,
  ) => {
    const notificationsReceived = get().notificationsReceived;

    set({
      updatedCountOfUnreadNotifications:
        renderableNewLikeOnPublishedItemNotification.countOfUnreadNotifications,
      notificationsReceived: [
        ...notificationsReceived,
        renderableNewLikeOnPublishedItemNotification as unknown as RenderableUserNotification,
      ],
    });
  };
