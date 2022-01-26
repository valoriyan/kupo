import { Server } from "socket.io";
import { RenderableUser } from "src/controllers/user/models";
import { EVENT_NAMES } from "../eventsConfig";
import { NewLikeOnPostNotification } from "./models";
import { generatePrivateUserWebSocketRoomName } from "../utilities";
import { RenderablePost } from "../../../controllers/post/models";

export async function notifyUserIdOfNewLikeOnPost({
  io,
  userThatLikedPost,
  post,
  userId,
}: {
  io: Server;
  userThatLikedPost: RenderableUser;
  post: RenderablePost;
  userId: string;
}): Promise<void> {
  const newLikeOnPostNotification: NewLikeOnPostNotification = {
    userThatLikedPost,
    post,
  };

  const roomName = generatePrivateUserWebSocketRoomName({ userId });
  io.to([roomName]).emit(EVENT_NAMES.NEW_LIKE_ON_POST, newLikeOnPostNotification);
}