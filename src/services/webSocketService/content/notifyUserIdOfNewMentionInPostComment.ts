import { Server } from "socket.io";
import { RenderableUser } from "src/controllers/user/models";
import { EVENT_NAMES } from "../eventsConfig";
import { NewMentionInPostCommentNotification } from "./models";
import { generatePrivateUserWebSocketRoomName } from "../utilities";
import { RenderablePost } from "../../../controllers/post/models";
import { RenderablePostComment } from "../../../controllers/postComment/models";

export async function notifyUserIdOfNewMentionInPostComment({
  io,
  userThatMentionedClient,
  post,
  commentWithinPost,
  userId,
}: {
  io: Server;
  userThatMentionedClient: RenderableUser;
  post: RenderablePost;
  commentWithinPost: RenderablePostComment;
  userId: string;
}): Promise<void> {
  const newMentionInPostCommentNotification: NewMentionInPostCommentNotification = {
    userThatMentionedClient,
    post,
    commentWithinPost,
  };

  const roomName = generatePrivateUserWebSocketRoomName({ userId });
  io.to([roomName]).emit(
    EVENT_NAMES.NEW_MENTION_IN_POST_COMMENT,
    newMentionInPostCommentNotification,
  );
}
