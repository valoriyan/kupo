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

import { FailedAuthResponse } from "./failed-auth-response";
import { FailedtoGetPageOfNotificationsResponse } from "./failedto-get-page-of-notifications-response";
import { SuccessfullyGotPageOfNotificationsResponse } from "./successfully-got-page-of-notifications-response";

/**
 *
 * @export
 * @interface SecuredHTTPResponseFailedtoGetPageOfNotificationsResponseSuccessfullyGotPageOfNotificationsResponse
 */
export interface SecuredHTTPResponseFailedtoGetPageOfNotificationsResponseSuccessfullyGotPageOfNotificationsResponse {
  /**
   *
   * @type {FailedtoGetPageOfNotificationsResponse | FailedAuthResponse}
   * @memberof SecuredHTTPResponseFailedtoGetPageOfNotificationsResponseSuccessfullyGotPageOfNotificationsResponse
   */
  error?: FailedtoGetPageOfNotificationsResponse | FailedAuthResponse;
  /**
   *
   * @type {SuccessfullyGotPageOfNotificationsResponse}
   * @memberof SecuredHTTPResponseFailedtoGetPageOfNotificationsResponseSuccessfullyGotPageOfNotificationsResponse
   */
  success?: SuccessfullyGotPageOfNotificationsResponse;
}
