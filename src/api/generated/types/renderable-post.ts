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

import { MediaElement } from "./media-element";
import { RenderablePostShared } from "./renderable-post-shared";
import { RenderableUserFollowers } from "./renderable-user-followers";

/**
 *
 * @export
 * @interface RenderablePost
 */
export interface RenderablePost {
  /**
   *
   * @type {string}
   * @memberof RenderablePost
   */
  postId: string;
  /**
   *
   * @type {string}
   * @memberof RenderablePost
   */
  authorUserId: string;
  /**
   *
   * @type {string}
   * @memberof RenderablePost
   */
  caption: string;
  /**
   *
   * @type {number}
   * @memberof RenderablePost
   */
  creationTimestamp: number;
  /**
   *
   * @type {number}
   * @memberof RenderablePost
   */
  scheduledPublicationTimestamp: number;
  /**
   *
   * @type {number}
   * @memberof RenderablePost
   */
  expirationTimestamp?: number;
  /**
   *
   * @type {string}
   * @memberof RenderablePost
   */
  sharedPostId?: string;
  /**
   *
   * @type {Array<MediaElement>}
   * @memberof RenderablePost
   */
  mediaElements: Array<MediaElement>;
  /**
   *
   * @type {Array<string>}
   * @memberof RenderablePost
   */
  hashtags: Array<string>;
  /**
   *
   * @type {RenderableUserFollowers}
   * @memberof RenderablePost
   */
  likes: RenderableUserFollowers;
  /**
   *
   * @type {RenderableUserFollowers}
   * @memberof RenderablePost
   */
  comments: RenderableUserFollowers;
  /**
   *
   * @type {boolean}
   * @memberof RenderablePost
   */
  isLikedByClient: boolean;
  /**
   *
   * @type {boolean}
   * @memberof RenderablePost
   */
  isSavedByClient: boolean;
  /**
   *
   * @type {RenderablePostShared}
   * @memberof RenderablePost
   */
  shared?: RenderablePostShared;
}
