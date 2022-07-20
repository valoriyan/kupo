import { BaseUserNotification } from ".";
import { RenderablePublishedItemComment } from "../../publishedItem/publishedItemComment/models";
import { RenderableUser } from "../../user/models";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { RenderablePublishedItem } from "../../../controllers/publishedItem/models";

export interface BaseRenderableUserNotification extends BaseUserNotification {
  eventTimestamp: number;
  timestampSeenByUser?: number;
}

export interface RenderableNewCommentOnPublishedItemNotification
  extends BaseRenderableUserNotification {
  type: NOTIFICATION_EVENTS.NEW_COMMENT_ON_PUBLISHED_ITEM;
  userThatCommented: RenderableUser;
  publishedItem: RenderablePublishedItem;
  publishedItemComment: RenderablePublishedItemComment;
}

export interface RenderableNewFollowerNotification
  extends BaseRenderableUserNotification {
  type: NOTIFICATION_EVENTS.NEW_FOLLOWER;
  userDoingFollowing: RenderableUser;
}

export interface RenderableNewLikeOnPublishedItemNotification
  extends BaseRenderableUserNotification {
  type: NOTIFICATION_EVENTS.NEW_LIKE_ON_PUBLISHED_ITEM;
  userThatLikedPublishedItem: RenderableUser;
  publishedItem: RenderablePublishedItem;
}

export interface RenderableNewTagInPublishedItemCommentNotification
  extends BaseRenderableUserNotification {
  type: NOTIFICATION_EVENTS.NEW_TAG_IN_PUBLISHED_ITEM_COMMENT;
  userTaggingClient: RenderableUser;
  publishedItem: RenderablePublishedItem;
  publishedItemComment: RenderablePublishedItemComment;
}

export type RenderableUserNotification =
  | RenderableNewFollowerNotification
  | RenderableNewCommentOnPublishedItemNotification
  | RenderableNewLikeOnPublishedItemNotification
  | RenderableNewTagInPublishedItemCommentNotification;
