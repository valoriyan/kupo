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
import { FailureResponseErrorReasonTypesStringOrGetPublishingChannelsFollowedByUserIdFailedReason } from "./failure-response-error-reason-types-string-or-get-publishing-channels-followed-by-user-id-failed-reason";
import { FailureResponseErrorReasonTypesStringOrGetPublishingChannelsFollowedByUserIdFailedReasonError } from "./failure-response-error-reason-types-string-or-get-publishing-channels-followed-by-user-id-failed-reason-error";
import { GetPublishingChannelsFollowedByUserIdSuccess } from "./get-publishing-channels-followed-by-user-id-success";
import { SuccessResponseGetPublishingChannelsFollowedByUserIdSuccess } from "./success-response-get-publishing-channels-followed-by-user-id-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrGetPublishingChannelsFollowedByUserIdFailedReasonGetPublishingChannelsFollowedByUserIdSuccess
 */
export interface EitherErrorReasonTypesStringOrGetPublishingChannelsFollowedByUserIdFailedReasonGetPublishingChannelsFollowedByUserIdSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrGetPublishingChannelsFollowedByUserIdFailedReasonGetPublishingChannelsFollowedByUserIdSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrGetPublishingChannelsFollowedByUserIdFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrGetPublishingChannelsFollowedByUserIdFailedReasonGetPublishingChannelsFollowedByUserIdSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrGetPublishingChannelsFollowedByUserIdFailedReasonError;
  /**
   *
   * @type {GetPublishingChannelsFollowedByUserIdSuccess}
   * @memberof EitherErrorReasonTypesStringOrGetPublishingChannelsFollowedByUserIdFailedReasonGetPublishingChannelsFollowedByUserIdSuccess
   */
  success: GetPublishingChannelsFollowedByUserIdSuccess;
}
