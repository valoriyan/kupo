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
import { FailureResponseErrorReasonTypesStringOrGetPublishingChannelByNameFailedReason } from "./failure-response-error-reason-types-string-or-get-publishing-channel-by-name-failed-reason";
import { FailureResponseErrorReasonTypesStringOrGetPublishingChannelByNameFailedReasonError } from "./failure-response-error-reason-types-string-or-get-publishing-channel-by-name-failed-reason-error";
import { GetPublishingChannelByNameSuccess } from "./get-publishing-channel-by-name-success";
import { SuccessResponseGetPublishingChannelByNameSuccess } from "./success-response-get-publishing-channel-by-name-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrGetPublishingChannelByNameFailedReasonGetPublishingChannelByNameSuccess
 */
export interface EitherErrorReasonTypesStringOrGetPublishingChannelByNameFailedReasonGetPublishingChannelByNameSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrGetPublishingChannelByNameFailedReasonGetPublishingChannelByNameSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrGetPublishingChannelByNameFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrGetPublishingChannelByNameFailedReasonGetPublishingChannelByNameSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrGetPublishingChannelByNameFailedReasonError;
  /**
   *
   * @type {GetPublishingChannelByNameSuccess}
   * @memberof EitherErrorReasonTypesStringOrGetPublishingChannelByNameFailedReasonGetPublishingChannelByNameSuccess
   */
  success: GetPublishingChannelByNameSuccess;
}
