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

import { EitherTypeSuccess } from "./either-type-success";
import { FailureResponseErrorReasonTypesStringOrUndoBanUserFromPublishingChannelFailedReason } from "./failure-response-error-reason-types-string-or-undo-ban-user-from-publishing-channel-failed-reason";
import { FailureResponseErrorReasonTypesStringOrUndoBanUserFromPublishingChannelFailedReasonError } from "./failure-response-error-reason-types-string-or-undo-ban-user-from-publishing-channel-failed-reason-error";
import { SuccessResponseUndoBanUserFromPublishingChannelSuccess } from "./success-response-undo-ban-user-from-publishing-channel-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrUndoBanUserFromPublishingChannelFailedReasonUndoBanUserFromPublishingChannelSuccess
 */
export interface EitherErrorReasonTypesStringOrUndoBanUserFromPublishingChannelFailedReasonUndoBanUserFromPublishingChannelSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrUndoBanUserFromPublishingChannelFailedReasonUndoBanUserFromPublishingChannelSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrUndoBanUserFromPublishingChannelFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrUndoBanUserFromPublishingChannelFailedReasonUndoBanUserFromPublishingChannelSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrUndoBanUserFromPublishingChannelFailedReasonError;
  /**
   *
   * @type {object}
   * @memberof EitherErrorReasonTypesStringOrUndoBanUserFromPublishingChannelFailedReasonUndoBanUserFromPublishingChannelSuccess
   */
  success: object;
}
