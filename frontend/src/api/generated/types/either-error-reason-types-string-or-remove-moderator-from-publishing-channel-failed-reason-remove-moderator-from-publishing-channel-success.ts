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
import { FailureResponseErrorReasonTypesStringOrRemoveModeratorFromPublishingChannelFailedReason } from "./failure-response-error-reason-types-string-or-remove-moderator-from-publishing-channel-failed-reason";
import { FailureResponseErrorReasonTypesStringOrRemoveModeratorFromPublishingChannelFailedReasonError } from "./failure-response-error-reason-types-string-or-remove-moderator-from-publishing-channel-failed-reason-error";
import { SuccessResponseRemoveModeratorFromPublishingChannelSuccess } from "./success-response-remove-moderator-from-publishing-channel-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrRemoveModeratorFromPublishingChannelFailedReasonRemoveModeratorFromPublishingChannelSuccess
 */
export interface EitherErrorReasonTypesStringOrRemoveModeratorFromPublishingChannelFailedReasonRemoveModeratorFromPublishingChannelSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrRemoveModeratorFromPublishingChannelFailedReasonRemoveModeratorFromPublishingChannelSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrRemoveModeratorFromPublishingChannelFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrRemoveModeratorFromPublishingChannelFailedReasonRemoveModeratorFromPublishingChannelSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrRemoveModeratorFromPublishingChannelFailedReasonError;
  /**
   *
   * @type {object}
   * @memberof EitherErrorReasonTypesStringOrRemoveModeratorFromPublishingChannelFailedReasonRemoveModeratorFromPublishingChannelSuccess
   */
  success: object;
}
