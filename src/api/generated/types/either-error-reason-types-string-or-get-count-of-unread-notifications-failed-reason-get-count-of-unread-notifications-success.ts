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

import { EitherTypeSuccess } from "./either-type-success";
import { FailureResponseErrorReasonTypesStringOrGetCountOfUnreadNotificationsFailedReason } from "./failure-response-error-reason-types-string-or-get-count-of-unread-notifications-failed-reason";
import { FailureResponseErrorReasonTypesStringOrGetCountOfUnreadNotificationsFailedReasonError } from "./failure-response-error-reason-types-string-or-get-count-of-unread-notifications-failed-reason-error";
import { GetCountOfUnreadNotificationsSuccess } from "./get-count-of-unread-notifications-success";
import { SuccessResponseGetCountOfUnreadNotificationsSuccess } from "./success-response-get-count-of-unread-notifications-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrGetCountOfUnreadNotificationsFailedReasonGetCountOfUnreadNotificationsSuccess
 */
export interface EitherErrorReasonTypesStringOrGetCountOfUnreadNotificationsFailedReasonGetCountOfUnreadNotificationsSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrGetCountOfUnreadNotificationsFailedReasonGetCountOfUnreadNotificationsSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrGetCountOfUnreadNotificationsFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrGetCountOfUnreadNotificationsFailedReasonGetCountOfUnreadNotificationsSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrGetCountOfUnreadNotificationsFailedReasonError;
  /**
   *
   * @type {GetCountOfUnreadNotificationsSuccess}
   * @memberof EitherErrorReasonTypesStringOrGetCountOfUnreadNotificationsFailedReasonGetCountOfUnreadNotificationsSuccess
   */
  success: GetCountOfUnreadNotificationsSuccess;
}
