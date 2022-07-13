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

import { AuthFailedReason } from "./auth-failed-reason";
import { GenericResponseFailedReason } from "./generic-response-failed-reason";
import { GetCountOfUnreadNotificationsFailedReason } from "./get-count-of-unread-notifications-failed-reason";

/**
 *
 * @export
 * @interface SecuredHTTPResponseGetCountOfUnreadNotificationsFailedReasonGetCountOfUnreadNotificationsSuccessError
 */
export interface SecuredHTTPResponseGetCountOfUnreadNotificationsFailedReasonGetCountOfUnreadNotificationsSuccessError {
  /**
   *
   * @type {string}
   * @memberof SecuredHTTPResponseGetCountOfUnreadNotificationsFailedReasonGetCountOfUnreadNotificationsSuccessError
   */
  additionalErrorInformation?: string;
  /**
   *
   * @type {string}
   * @memberof SecuredHTTPResponseGetCountOfUnreadNotificationsFailedReasonGetCountOfUnreadNotificationsSuccessError
   */
  errorMessage?: string;
  /**
   *
   * @type {GetCountOfUnreadNotificationsFailedReason | GenericResponseFailedReason | AuthFailedReason}
   * @memberof SecuredHTTPResponseGetCountOfUnreadNotificationsFailedReasonGetCountOfUnreadNotificationsSuccessError
   */
  reason:
    | GetCountOfUnreadNotificationsFailedReason
    | GenericResponseFailedReason
    | AuthFailedReason;
}
