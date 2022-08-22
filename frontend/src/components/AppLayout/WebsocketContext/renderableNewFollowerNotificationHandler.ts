import { GetState, SetState } from "zustand";
import { RenderableNewFollowerNotification, RenderableUserNotification } from "#/api";
import { WebsocketState } from ".";

export const generateRenderableNewFollowerNotificationHandler =
  ({ set, get }: { set: SetState<WebsocketState>; get: GetState<WebsocketState> }) =>
  (renderableNewFollowerNotification: RenderableNewFollowerNotification) => {
    const notificationsReceived = get().notificationsReceived;
    set({
      updatedCountOfUnreadNotifications:
        renderableNewFollowerNotification.countOfUnreadNotifications,
      notificationsReceived: [
        ...notificationsReceived,
        renderableNewFollowerNotification as unknown as RenderableUserNotification,
      ],
    });
  };
