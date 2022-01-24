import { Server } from "socket.io";
import { RenderableUser } from "src/controllers/user/models";
import { EVENT_NAMES } from "../eventsConfig";
import { NewMentionInPostNotification } from "./models";
import { generatePrivateUserWebSocketRoomName } from "../utilities";
import { RenderablePost } from "../../../controllers/post/models";

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
  io.to([roomName]).emit(EVENT_NAMES.NEW_MENTION_IN_POST, newMentionInPostNotification);
}
