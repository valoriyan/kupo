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

import { RenderableUserNotification } from "./renderable-user-notification";

/**
 *
 * @export
 * @interface GetPageOfNotificationsSuccess
 */
export interface GetPageOfNotificationsSuccess {
  /**
   *
   * @type {Array<RenderableUserNotification>}
   * @memberof GetPageOfNotificationsSuccess
   */
  userNotifications: Array<RenderableUserNotification>;
  /**
   *
   * @type {string}
   * @memberof GetPageOfNotificationsSuccess
   */
  previousPageCursor?: string;
  /**
   *
   * @type {string}
   * @memberof GetPageOfNotificationsSuccess
   */
  nextPageCursor?: string;
}
