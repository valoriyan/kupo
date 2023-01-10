import { BaseUserNotification } from ".";
import { RenderablePublishedItemComment } from "../../publishedItem/publishedItemComment/models";
import { RenderableUser } from "../../user/models";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { RenderablePublishedItem } from "../../../controllers/publishedItem/models";
import { RenderableShopItem } from "../../../controllers/publishedItem/shopItem/models";
import { RenderablePublishingChannel } from "../../../controllers/publishingChannel/models";

export interface BaseRenderableUserNotification extends BaseUserNotification {
  eventTimestamp: number;
  timestampSeenByUser?: number;
}

//////////////////////////////////////////////////
// Followers
//////////////////////////////////////////////////

export interface RenderableAcceptedUserFollowRequestNotification
  extends BaseRenderableUserNotification {
  type: NOTIFICATION_EVENTS.ACCEPTED_USER_FOLLOW_REQUEST;
  userAcceptingFollowRequest: RenderableUser;
}

export interface RenderableNewFollowerNotification
  extends BaseRenderableUserNotification {
  type: NOTIFICATION_EVENTS.NEW_FOLLOWER;
  userDoingFollowing: RenderableUser;
}

export interface RenderableNewUserFollowRequestNotification
  extends BaseRenderableUserNotification {
  type: NOTIFICATION_EVENTS.NEW_USER_FOLLOW_REQUEST;
  followRequestingUser: RenderableUser;
}

//////////////////////////////////////////////////
// Published Items
//////////////////////////////////////////////////

export interface RenderableNewCommentOnPublishedItemNotification
  extends BaseRenderableUserNotification {
  type: NOTIFICATION_EVENTS.NEW_COMMENT_ON_PUBLISHED_ITEM;
  userThatCommented: RenderableUser;
  publishedItem: RenderablePublishedItem;
  publishedItemComment: RenderablePublishedItemComment;
}

export interface RenderableNewLikeOnPublishedItemNotification
  extends BaseRenderableUserNotification {
  type: NOTIFICATION_EVENTS.NEW_LIKE_ON_PUBLISHED_ITEM;
  userThatLikedPublishedItem: RenderableUser;
  publishedItem: RenderablePublishedItem;
}

export interface RenderableNewShareOfPublishedItemNotification
  extends BaseRenderableUserNotification {
  type: NOTIFICATION_EVENTS.NEW_SHARE_OF_PUBLISHED_ITEM;
  userSharingPublishedItem: RenderableUser;
  sourcePublishedItem: RenderablePublishedItem;
  newPublishedItemId: string;
}

export interface RenderableNewTagInPublishedItemCaptionNotification
  extends BaseRenderableUserNotification {
  type: NOTIFICATION_EVENTS.NEW_TAG_IN_PUBLISHED_ITEM_CAPTION;
  userTaggingClient: RenderableUser;
  publishedItem: RenderablePublishedItem;
}

export interface RenderableNewTagInPublishedItemCommentNotification
  extends BaseRenderableUserNotification {
  type: NOTIFICATION_EVENTS.NEW_TAG_IN_PUBLISHED_ITEM_COMMENT;
  userTaggingClient: RenderableUser;
  publishedItem: RenderablePublishedItem;
  publishedItemComment: RenderablePublishedItemComment;
}

//////////////////////////////////////////////////
// Publishing Channels
//////////////////////////////////////////////////

export interface RenderableAcceptedPublishingChannelSubmissionNotification
  extends BaseRenderableUserNotification {
  type: NOTIFICATION_EVENTS.ACCEPTED_PUBLISHING_CHANNEL_SUBMISSION;
  publishedItem: RenderablePublishedItem;
  publishingChannel: RenderablePublishingChannel;
}

export interface RenderableRejectedPublishingChannelSubmissionNotification
  extends BaseRenderableUserNotification {
  type: NOTIFICATION_EVENTS.REJECTED_PUBLISHING_CHANNEL_SUBMISSION;
  publishedItem: RenderablePublishedItem;
  publishingChannel: RenderablePublishingChannel;
  rejectionSummary: {
    // maybe add the user who rejected the submission
    rejectionReason: string;
  };
}

//////////////////////////////////////////////////
// Transactions
//////////////////////////////////////////////////

export interface RenderableShopItemSoldNotification
  extends BaseRenderableUserNotification {
  type: NOTIFICATION_EVENTS.SHOP_ITEM_SOLD;
  purchaser: RenderableUser;
  shopItem: RenderableShopItem;
}

//////////////////////////////////////////////////
// Union Type
//////////////////////////////////////////////////

export type RenderableUserNotification =
  // Followers
  | RenderableAcceptedUserFollowRequestNotification
  | RenderableNewFollowerNotification
  | RenderableNewUserFollowRequestNotification

  // Published Items
  | RenderableNewCommentOnPublishedItemNotification
  | RenderableNewLikeOnPublishedItemNotification
  | RenderableNewShareOfPublishedItemNotification
  | RenderableNewTagInPublishedItemCaptionNotification
  | RenderableNewTagInPublishedItemCommentNotification

  // Publishing Channels
  | RenderableAcceptedPublishingChannelSubmissionNotification
  | RenderableRejectedPublishingChannelSubmissionNotification

  // Transactions
  | RenderableShopItemSoldNotification;
