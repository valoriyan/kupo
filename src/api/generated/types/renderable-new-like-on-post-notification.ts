/* tslint:disable */
/* eslint-disable */
/**
 * kupono-backend
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.0.1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { NOTIFICATIONEVENTSNEWLIKEONPOST } from "./notificationeventsnewlikeonpost";
import { RenderablePost } from "./renderable-post";
import { RenderableUser } from "./renderable-user";

/**
 *
 * @export
 * @interface RenderableNewLikeOnPostNotification
 */
export interface RenderableNewLikeOnPostNotification {
  /**
   *
   * @type {NOTIFICATIONEVENTSNEWLIKEONPOST}
   * @memberof RenderableNewLikeOnPostNotification
   */
  type: NOTIFICATIONEVENTSNEWLIKEONPOST;
  /**
   *
   * @type {number}
   * @memberof RenderableNewLikeOnPostNotification
   */
  countOfUnreadNotifications: number;
  /**
   *
   * @type {number}
   * @memberof RenderableNewLikeOnPostNotification
   */
  eventTimestamp: number;
  /**
   *
   * @type {number}
   * @memberof RenderableNewLikeOnPostNotification
   */
  timestampSeenByUser?: number;
  /**
   *
   * @type {RenderableUser}
   * @memberof RenderableNewLikeOnPostNotification
   */
  userThatLikedPost: RenderableUser;
  /**
   *
   * @type {RenderablePost}
   * @memberof RenderableNewLikeOnPostNotification
   */
  post: RenderablePost;
}
