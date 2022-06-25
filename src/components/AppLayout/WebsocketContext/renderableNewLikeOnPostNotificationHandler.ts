import { GetState, SetState } from "zustand";
import { RenderableNewLikeOnPostNotification, RenderableUserNotification } from "#/api";
import { WebsocketState } from ".";

export const generateRenderableNewLikeOnPostNotificationHandler =
  ({ set, get }: { set: SetState<WebsocketState>; get: GetState<WebsocketState> }) =>
  (renderableNewLikeOnPostNotification: RenderableNewLikeOnPostNotification) => {
    const notificationsReceived = get().notificationsReceived;

    set({
      updatedCountOfUnreadNotifications:
        renderableNewLikeOnPostNotification.countOfUnreadNotifications,
      notificationsReceived: [
        ...notificationsReceived,
        renderableNewLikeOnPostNotification as unknown as RenderableUserNotification,
      ],
    });
  };
