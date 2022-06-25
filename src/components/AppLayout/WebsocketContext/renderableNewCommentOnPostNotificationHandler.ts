import { GetState, SetState } from "zustand";
import {
  RenderableNewCommentOnPostNotification,
  RenderableUserNotification,
} from "#/api";
import { WebsocketState } from ".";

export const generateRenderableNewCommentOnPostNotificationHandler =
  ({ set, get }: { set: SetState<WebsocketState>; get: GetState<WebsocketState> }) =>
  (renderableNewCommentOnPostNotification: RenderableNewCommentOnPostNotification) => {
    const notificationsReceived = get().notificationsReceived;
    set({
      updatedCountOfUnreadNotifications:
        renderableNewCommentOnPostNotification.countOfUnreadNotifications,
      notificationsReceived: [
        ...notificationsReceived,
        renderableNewCommentOnPostNotification as unknown as RenderableUserNotification,
      ],
    });
  };
