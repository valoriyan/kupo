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

/**
 *
 * @export
 * @interface UnrenderableCanceledCommentOnPostNotification
 */
export interface UnrenderableCanceledCommentOnPostNotification {
  /**
   *
   * @type {NOTIFICATIONEVENTS}
   * @memberof UnrenderableCanceledCommentOnPostNotification
   */
  type: NOTIFICATIONEVENTS;
  /**
   *
   * @type {number}
   * @memberof UnrenderableCanceledCommentOnPostNotification
   */
  countOfUnreadNotifications: number;
  /**
   *
   * @type {string}
   * @memberof UnrenderableCanceledCommentOnPostNotification
   */
  postCommentId: string;
}
