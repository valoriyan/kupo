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

import { NOTIFICATIONEVENTSNEWTAGINPUBLISHEDITEMCOMMENT } from "./notificationeventsnewtaginpublisheditemcomment";
import { RenderablePublishedItem } from "./renderable-published-item";
import { RenderablePublishedItemComment } from "./renderable-published-item-comment";
import { RenderableUser } from "./renderable-user";

/**
 *
 * @export
 * @interface RenderableNewTagInPublishedItemCommentNotification
 */
export interface RenderableNewTagInPublishedItemCommentNotification {
  /**
   *
   * @type {NOTIFICATIONEVENTSNEWTAGINPUBLISHEDITEMCOMMENT}
   * @memberof RenderableNewTagInPublishedItemCommentNotification
   */
  type: NOTIFICATIONEVENTSNEWTAGINPUBLISHEDITEMCOMMENT;
  /**
   *
   * @type {number}
   * @memberof RenderableNewTagInPublishedItemCommentNotification
   */
  countOfUnreadNotifications: number;
  /**
   *
   * @type {number}
   * @memberof RenderableNewTagInPublishedItemCommentNotification
   */
  eventTimestamp: number;
  /**
   *
   * @type {number}
   * @memberof RenderableNewTagInPublishedItemCommentNotification
   */
  timestampSeenByUser?: number;
  /**
   *
   * @type {RenderableUser}
   * @memberof RenderableNewTagInPublishedItemCommentNotification
   */
  userTaggingClient: RenderableUser;
  /**
   *
   * @type {RenderablePublishedItem}
   * @memberof RenderableNewTagInPublishedItemCommentNotification
   */
  publishedItem: RenderablePublishedItem;
  /**
   *
   * @type {RenderablePublishedItemComment}
   * @memberof RenderableNewTagInPublishedItemCommentNotification
   */
  publishedItemComment: RenderablePublishedItemComment;
}
