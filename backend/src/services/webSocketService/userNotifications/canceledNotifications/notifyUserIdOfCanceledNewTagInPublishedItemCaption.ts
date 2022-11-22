import { Server } from "socket.io";
import { UnrenderableCanceledNewTagInPublishedItemCaptionNotification } from "../../../../controllers/notification/models/unrenderableCanceledUserNotifications";
import { NOTIFICATION_EVENTS } from "../../eventsConfig";
import { generatePrivateUserWebSocketRoomName } from "../../utilities";

export async function notifyUserIdOfCanceledNewTagInPublishedItemCaption({
  io,
  unrenderableCanceledNewTagInPublishedItemCaptionNotification,
  userId,
}: {
  io: Server;
  unrenderableCanceledNewTagInPublishedItemCaptionNotification: UnrenderableCanceledNewTagInPublishedItemCaptionNotification;
  userId: string;
}): Promise<void> {
  const roomName = generatePrivateUserWebSocketRoomName({ userId });

  io.to([roomName]).emit(
    NOTIFICATION_EVENTS.CANCELED_NEW_TAG_IN_PUBLISHED_ITEM_CAPTION,
    unrenderableCanceledNewTagInPublishedItemCaptionNotification,
  );
}