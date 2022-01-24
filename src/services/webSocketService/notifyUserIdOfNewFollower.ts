import { Server } from "socket.io";
import { RenderableUser } from "src/controllers/user/models";
import { EVENT_NAMES } from "./eventsConfig";
import { generatePrivateUserWebSocketRoomName } from "./utilities";

export async function notifyUserIdOfNewFollower({
  io,
  newFollower,
  userId,
}: {
  io: Server;
  newFollower: RenderableUser;
  userId: string;
}): Promise<void> {
  const roomName = generatePrivateUserWebSocketRoomName({ userId });

  io.to([roomName]).emit(EVENT_NAMES.NEW_FOLLOWER, newFollower);
}
