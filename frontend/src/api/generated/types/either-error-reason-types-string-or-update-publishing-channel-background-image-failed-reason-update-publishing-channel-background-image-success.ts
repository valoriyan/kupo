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
import { FailureResponseErrorReasonTypesStringOrUpdatePublishingChannelBackgroundImageFailedReason } from "./failure-response-error-reason-types-string-or-update-publishing-channel-background-image-failed-reason";
import { FailureResponseErrorReasonTypesStringOrUpdatePublishingChannelBackgroundImageFailedReasonError } from "./failure-response-error-reason-types-string-or-update-publishing-channel-background-image-failed-reason-error";
import { SuccessResponseUpdatePublishingChannelBackgroundImageSuccess } from "./success-response-update-publishing-channel-background-image-success";
import { UpdatePublishingChannelBackgroundImageSuccess } from "./update-publishing-channel-background-image-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrUpdatePublishingChannelBackgroundImageFailedReasonUpdatePublishingChannelBackgroundImageSuccess
 */
export interface EitherErrorReasonTypesStringOrUpdatePublishingChannelBackgroundImageFailedReasonUpdatePublishingChannelBackgroundImageSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrUpdatePublishingChannelBackgroundImageFailedReasonUpdatePublishingChannelBackgroundImageSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrUpdatePublishingChannelBackgroundImageFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrUpdatePublishingChannelBackgroundImageFailedReasonUpdatePublishingChannelBackgroundImageSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrUpdatePublishingChannelBackgroundImageFailedReasonError;
  /**
   *
   * @type {UpdatePublishingChannelBackgroundImageSuccess}
   * @memberof EitherErrorReasonTypesStringOrUpdatePublishingChannelBackgroundImageFailedReasonUpdatePublishingChannelBackgroundImageSuccess
   */
  success: UpdatePublishingChannelBackgroundImageSuccess;
}