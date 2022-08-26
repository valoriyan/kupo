import { BaseUserNotification } from ".";

export interface UnrenderableCanceledCommentOnPublishedItemNotification
  extends BaseUserNotification {
  publishedItemCommentId: string;
}

export interface UnrenderableCanceledNewFollowerNotification
  extends BaseUserNotification {
  userIdDoingUnfollowing: string;
}

export interface UnrenderableCanceledNewLikeOnPublishedItemNotification
  extends BaseUserNotification {
  userIdUnlikingPost: string;
  publishedItemId: string;
}

export interface UnrenderableCanceledNewTagInPublishedItemCommentNotification
  extends BaseUserNotification {
  publishedItemCommentId: string;
}