import { GetState, SetState } from "zustand";
import {
  RenderableNewCommentOnPublishedItemNotification,
  RenderableUserNotification,
} from "#/api";
import { WebsocketState } from ".";

export const generateRenderableNewCommentOnPublishedItemNotificationHandler =
  ({ set, get }: { set: SetState<WebsocketState>; get: GetState<WebsocketState> }) =>
  (
    renderableNewCommentOnPublishedItemNotification: RenderableNewCommentOnPublishedItemNotification,
  ) => {
    const notificationsReceived = get().notificationsReceived;
    set({
      updatedCountOfUnreadNotifications:
        renderableNewCommentOnPublishedItemNotification.countOfUnreadNotifications,
      notificationsReceived: [
        ...notificationsReceived,
        renderableNewCommentOnPublishedItemNotification as unknown as RenderableUserNotification,
      ],
    });
  };
