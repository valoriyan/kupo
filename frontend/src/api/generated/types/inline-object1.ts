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

import { NewChatMessageNotification } from "./new-chat-message-notification";
import { UnrenderableCanceledCommentOnPublishedItemNotification } from "./unrenderable-canceled-comment-on-published-item-notification";
import { UnrenderableCanceledNewFollowerNotification } from "./unrenderable-canceled-new-follower-notification";
import { UnrenderableCanceledNewLikeOnPublishedItemNotification } from "./unrenderable-canceled-new-like-on-published-item-notification";

/**
 *
 * @export
 * @interface InlineObject1
 */
export interface InlineObject1 {
  /**
   *
   * @type {NewChatMessageNotification}
   * @memberof InlineObject1
   */
  NewChatMessageNotification: NewChatMessageNotification;
  /**
   *
   * @type {UnrenderableCanceledNewLikeOnPublishedItemNotification}
   * @memberof InlineObject1
   */
  UnrenderableCanceledNewLikeOnPostNotification: UnrenderableCanceledNewLikeOnPublishedItemNotification;
  /**
   *
   * @type {UnrenderableCanceledNewFollowerNotification}
   * @memberof InlineObject1
   */
  UnrenderableCanceledNewFollowerNotification: UnrenderableCanceledNewFollowerNotification;
  /**
   *
   * @type {UnrenderableCanceledCommentOnPublishedItemNotification}
   * @memberof InlineObject1
   */
  UnrenderableCanceledCommentOnPostNotification: UnrenderableCanceledCommentOnPublishedItemNotification;
}
