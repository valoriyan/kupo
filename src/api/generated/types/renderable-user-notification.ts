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

import { NOTIFICATIONEVENTS } from "./notificationevents";
import { RenderableNewCommentOnPostNotification } from "./renderable-new-comment-on-post-notification";
import { RenderableNewFollowerNotification } from "./renderable-new-follower-notification";
import { RenderableNewLikeOnPostNotification } from "./renderable-new-like-on-post-notification";
import { RenderablePost } from "./renderable-post";
import { RenderablePostComment } from "./renderable-post-comment";
import { RenderableUser } from "./renderable-user";

/**
 *
 * @export
 * @interface RenderableUserNotification
 */
export interface RenderableUserNotification {
  /**
   *
   * @type {NOTIFICATIONEVENTS}
   * @memberof RenderableUserNotification
   */
  type: NOTIFICATIONEVENTS;
  /**
   *
   * @type {number}
   * @memberof RenderableUserNotification
   */
  timestampSeenByUser?: number;
  /**
   *
   * @type {RenderableUser}
   * @memberof RenderableUserNotification
   */
  userDoingFollowing: RenderableUser;
  /**
   *
   * @type {RenderableUser}
   * @memberof RenderableUserNotification
   */
  userThatCommented: RenderableUser;
  /**
   *
   * @type {RenderablePost}
   * @memberof RenderableUserNotification
   */
  post: RenderablePost;
  /**
   *
   * @type {RenderablePostComment}
   * @memberof RenderableUserNotification
   */
  postComment: RenderablePostComment;
  /**
   *
   * @type {RenderableUser}
   * @memberof RenderableUserNotification
   */
  userThatLikedPost: RenderableUser;
}
