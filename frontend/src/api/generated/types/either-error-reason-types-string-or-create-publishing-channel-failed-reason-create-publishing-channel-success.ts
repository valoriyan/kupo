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
import { FailureResponseErrorReasonTypesStringOrCreatePublishingChannelFailedReason } from "./failure-response-error-reason-types-string-or-create-publishing-channel-failed-reason";
import { FailureResponseErrorReasonTypesStringOrCreatePublishingChannelFailedReasonError } from "./failure-response-error-reason-types-string-or-create-publishing-channel-failed-reason-error";
import { SuccessResponseCreatePublishingChannelSuccess } from "./success-response-create-publishing-channel-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrCreatePublishingChannelFailedReasonCreatePublishingChannelSuccess
 */
export interface EitherErrorReasonTypesStringOrCreatePublishingChannelFailedReasonCreatePublishingChannelSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrCreatePublishingChannelFailedReasonCreatePublishingChannelSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrCreatePublishingChannelFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrCreatePublishingChannelFailedReasonCreatePublishingChannelSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrCreatePublishingChannelFailedReasonError;
  /**
   *
   * @type {object}
   * @memberof EitherErrorReasonTypesStringOrCreatePublishingChannelFailedReasonCreatePublishingChannelSuccess
   */
  success: object;
}