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

import { EitherTypeFailure } from "./either-type-failure";
import { FailureResponseErrorReasonTypesStringOrGetCountOfUnreadNotificationsFailedReasonError } from "./failure-response-error-reason-types-string-or-get-count-of-unread-notifications-failed-reason-error";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrGetCountOfUnreadNotificationsFailedReason
 */
export interface FailureResponseErrorReasonTypesStringOrGetCountOfUnreadNotificationsFailedReason {
  /**
   *
   * @type {EitherTypeFailure}
   * @memberof FailureResponseErrorReasonTypesStringOrGetCountOfUnreadNotificationsFailedReason
   */
  type: EitherTypeFailure;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrGetCountOfUnreadNotificationsFailedReasonError}
   * @memberof FailureResponseErrorReasonTypesStringOrGetCountOfUnreadNotificationsFailedReason
   */
  error: FailureResponseErrorReasonTypesStringOrGetCountOfUnreadNotificationsFailedReasonError;
}