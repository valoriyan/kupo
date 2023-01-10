import { UserId } from "aws-sdk/clients/appstream";
import { BaseUserNotification } from ".";

//////////////////////////////////////////////////
// Followers
//////////////////////////////////////////////////

export interface UnrenderableCanceledAcceptedUserFollowRequestNotification
  extends BaseUserNotification {
  userIdUnacceptingFollowRequest: string;
}

export interface UnrenderableCanceledNewFollowerNotification
  extends BaseUserNotification {
  userIdDoingUnfollowing: string;
}

export interface UnrenderableCanceledNewUserFollowRequestNotification
  extends BaseUserNotification {
  userIdWithdrawingFollowRequest: string;
}

//////////////////////////////////////////////////
// Published Items
//////////////////////////////////////////////////
export interface UnrenderableCanceledNewCommentOnPublishedItemNotification
  extends BaseUserNotification {
  publishedItemCommentId: string;
}

export interface UnrenderableCanceledNewLikeOnPublishedItemNotification
  extends BaseUserNotification {
  userIdUnlikingPublishedItem: string;
  publishedItemId: string;
}

export interface UnrenderableCanceledNewShareOfPublishedItemNotification
  extends BaseUserNotification {
  userIdNoLongerSharingPublishedItem: UserId;
  publishedItemId: string;
}

export interface UnrenderableCanceledNewTagInPublishedItemCaptionNotification
  extends BaseUserNotification {
  publishedItemId: string;
}

export interface UnrenderableCanceledNewTagInPublishedItemCommentNotification
  extends BaseUserNotification {
  publishedItemCommentId: string;
}

//////////////////////////////////////////////////
// Publishing Channels
//////////////////////////////////////////////////

//////////////////////////////////////////////////
// Transactions
//////////////////////////////////////////////////
