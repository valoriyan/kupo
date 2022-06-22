import { Server } from "socket.io";
import { RenderableUser } from "../../../../controllers/user/models";
import { NOTIFICATION_EVENTS } from "../../eventsConfig";
import { NewMentionInPostNotification } from "../models";
import { generatePrivateUserWebSocketRoomName } from "../../utilities";
import { RenderablePost } from "../../../../controllers/publishedItem/post/models";

export async function notifyUserIdOfNewMentionInPost({
  io,
  userThatMentionedClient,
  post,
  userId,
}: {
  io: Server;
  userThatMentionedClient: RenderableUser;
  post: RenderablePost;
  userId: string;
}): Promise<void> {
  const newMentionInPostNotification: NewMentionInPostNotification = {
    userThatMentionedClient,
    post,
  };

  const roomName = generatePrivateUserWebSocketRoomName({ userId });
  io.to([roomName]).emit(
    NOTIFICATION_EVENTS.NEW_MENTION_IN_POST,
    newMentionInPostNotification,
  );
}
