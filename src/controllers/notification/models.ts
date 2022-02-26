import { NOTIFICATION_EVENTS } from "../../services/webSocketService/eventsConfig";
import { RenderablePost } from "../post/models";
import { RenderablePostComment } from "../postComment/models";
import { RenderableUser } from "../user/models";

export interface BaseNotification {
  type: NOTIFICATION_EVENTS;
  timestampSeenByUser?: number;
}

export interface RenderableNewFollowerNotification extends BaseNotification {
  userDoingFollowing: RenderableUser;
}

export interface RenderableNewCommentOnPostNotification extends BaseNotification {
  userThatCommented: RenderableUser;
  post: RenderablePost;
  postComment: RenderablePostComment;
}

export interface RenderableNewLikeOnPostNotification extends BaseNotification {
  userThatLikedPost: RenderableUser;
  post: RenderablePost;
}

export type RenderableUserNotification =
  | RenderableNewFollowerNotification
  | RenderableNewCommentOnPostNotification
  | RenderableNewLikeOnPostNotification;
