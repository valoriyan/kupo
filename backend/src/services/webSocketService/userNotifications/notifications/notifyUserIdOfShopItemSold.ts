import { Server } from "socket.io";
import { RenderableShopItemSoldNotification } from "../../../../controllers/notification/models/renderableUserNotifications";
import { NOTIFICATION_EVENTS } from "../../eventsConfig";
import { generatePrivateUserWebSocketRoomName } from "../../utilities";

export async function notifyUserIdOfShopItemSold({
  io,
  renderableShopItemSoldNotification,
  userId,
}: {
  io: Server;
  renderableShopItemSoldNotification: RenderableShopItemSoldNotification;
  userId: string;
}): Promise<void> {
  const roomName = generatePrivateUserWebSocketRoomName({ userId });

  io.to([roomName]).emit(
    NOTIFICATION_EVENTS.SHOP_ITEM_SOLD,
    renderableShopItemSoldNotification,
  );
}
