/* tslint:disable */
/* eslint-disable */
/**
 * kupo-backend
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.0.1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 *
 * @export
 * @enum {string}
 */
export enum NOTIFICATIONEVENTS {
  DeletedChatMessage = "DELETED_CHAT_MESSAGE",
  NewChatMessage = "NEW_CHAT_MESSAGE",
  NewCommentOnPublishedItem = "NEW_COMMENT_ON_PUBLISHED_ITEM",
  CanceledNewCommentOnPublishedItem = "CANCELED_NEW_COMMENT_ON_PUBLISHED_ITEM",
  NewFollower = "NEW_FOLLOWER",
  CanceledNewFollower = "CANCELED_NEW_FOLLOWER",
  NewUserFollowRequest = "NEW_USER_FOLLOW_REQUEST",
  CanceledNewUserFollowRequest = "CANCELED_NEW_USER_FOLLOW_REQUEST",
  AcceptedUserFollowRequest = "ACCEPTED_USER_FOLLOW_REQUEST",
  CanceledAcceptedUserFollowRequest = "CANCELED_ACCEPTED_USER_FOLLOW_REQUEST",
  NewLikeOnPublishedItem = "NEW_LIKE_ON_PUBLISHED_ITEM",
  CanceledNewLikeOnPublishedItem = "CANCELED_NEW_LIKE_ON_PUBLISHED_ITEM",
  NewTagInPublishedItemComment = "NEW_TAG_IN_PUBLISHED_ITEM_COMMENT",
  CanceledNewTagInPublishedItemComment = "CANCELED_NEW_TAG_IN_PUBLISHED_ITEM_COMMENT",
  NewTagInPublishedItemCaption = "NEW_TAG_IN_PUBLISHED_ITEM_CAPTION",
  CanceledNewTagInPublishedItemCaption = "CANCELED_NEW_TAG_IN_PUBLISHED_ITEM_CAPTION",
  AcceptedPublishingChannelSubmission = "ACCEPTED_PUBLISHING_CHANNEL_SUBMISSION",
  RejectedPublishingChannelSubmission = "REJECTED_PUBLISHING_CHANNEL_SUBMISSION",
  ShopItemSold = "SHOP_ITEM_SOLD",
  NewPublishedItem = "NEW_PUBLISHED_ITEM",
}
