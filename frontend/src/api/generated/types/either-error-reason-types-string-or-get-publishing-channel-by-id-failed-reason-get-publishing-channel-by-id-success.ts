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
import { FailureResponseErrorReasonTypesStringOrGetPublishingChannelByIdFailedReason } from "./failure-response-error-reason-types-string-or-get-publishing-channel-by-id-failed-reason";
import { FailureResponseErrorReasonTypesStringOrGetPublishingChannelByIdFailedReasonError } from "./failure-response-error-reason-types-string-or-get-publishing-channel-by-id-failed-reason-error";
import { GetPublishingChannelByIdSuccess } from "./get-publishing-channel-by-id-success";
import { SuccessResponseGetPublishingChannelByIdSuccess } from "./success-response-get-publishing-channel-by-id-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrGetPublishingChannelByIdFailedReasonGetPublishingChannelByIdSuccess
 */
export interface EitherErrorReasonTypesStringOrGetPublishingChannelByIdFailedReasonGetPublishingChannelByIdSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrGetPublishingChannelByIdFailedReasonGetPublishingChannelByIdSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrGetPublishingChannelByIdFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrGetPublishingChannelByIdFailedReasonGetPublishingChannelByIdSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrGetPublishingChannelByIdFailedReasonError;
  /**
   *
   * @type {GetPublishingChannelByIdSuccess}
   * @memberof EitherErrorReasonTypesStringOrGetPublishingChannelByIdFailedReasonGetPublishingChannelByIdSuccess
   */
  success: GetPublishingChannelByIdSuccess;
}
