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
import { FailureResponseErrorReasonTypesStringOrGetPageOfNotificationsFailedReason } from "./failure-response-error-reason-types-string-or-get-page-of-notifications-failed-reason";
import { FailureResponseErrorReasonTypesStringOrGetPageOfNotificationsFailedReasonError } from "./failure-response-error-reason-types-string-or-get-page-of-notifications-failed-reason-error";
import { GetPageOfNotificationsSuccess } from "./get-page-of-notifications-success";
import { SuccessResponseGetPageOfNotificationsSuccess } from "./success-response-get-page-of-notifications-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrGetPageOfNotificationsFailedReasonGetPageOfNotificationsSuccess
 */
export interface EitherErrorReasonTypesStringOrGetPageOfNotificationsFailedReasonGetPageOfNotificationsSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrGetPageOfNotificationsFailedReasonGetPageOfNotificationsSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrGetPageOfNotificationsFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrGetPageOfNotificationsFailedReasonGetPageOfNotificationsSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrGetPageOfNotificationsFailedReasonError;
  /**
   *
   * @type {GetPageOfNotificationsSuccess}
   * @memberof EitherErrorReasonTypesStringOrGetPageOfNotificationsFailedReasonGetPageOfNotificationsSuccess
   */
  success: GetPageOfNotificationsSuccess;
}
