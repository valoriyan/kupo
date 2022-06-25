import { BaseUserNotification } from ".";
import { RenderablePost } from "../../publishedItem/post/models";
import { RenderablePostComment } from "../../postComment/models";
import { RenderableUser } from "../../user/models";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";

export interface BaseRenderableUserNotification extends BaseUserNotification {
  eventTimestamp: number;
  timestampSeenByUser?: number;
}

export interface RenderableNewCommentOnPostNotification
  extends BaseRenderableUserNotification {
  type: NOTIFICATION_EVENTS.NEW_COMMENT_ON_POST;
  userThatCommented: RenderableUser;
  post: RenderablePost;
  postComment: RenderablePostComment;
}

export interface RenderableNewFollowerNotification
  extends BaseRenderableUserNotification {
  type: NOTIFICATION_EVENTS.NEW_FOLLOWER;
  userDoingFollowing: RenderableUser;
}

export interface RenderableNewLikeOnPostNotification
  extends BaseRenderableUserNotification {
  type: NOTIFICATION_EVENTS.NEW_LIKE_ON_POST;
  userThatLikedPost: RenderableUser;
  post: RenderablePost;
}

export interface RenderableNewTagInPublishedItemCommentNotification
  extends BaseRenderableUserNotification {
  type: NOTIFICATION_EVENTS.NEW_TAG_IN_PUBLISHED_ITEM_COMMENT;
  userTaggingClient: RenderableUser;
  publishedItem: RenderablePost;
  publishedItemComment: RenderablePostComment;
}

export type RenderableUserNotification =
  | RenderableNewFollowerNotification
  | RenderableNewCommentOnPostNotification
  | RenderableNewLikeOnPostNotification
  | RenderableNewTagInPublishedItemCommentNotification;
