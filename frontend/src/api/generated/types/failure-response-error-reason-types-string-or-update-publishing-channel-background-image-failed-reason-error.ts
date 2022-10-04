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

import { AuthFailedReason } from "./auth-failed-reason";
import { ErrorReasonTypesStringOrUpdatePublishingChannelBackgroundImageFailedReason } from "./error-reason-types-string-or-update-publishing-channel-background-image-failed-reason";
import { GenericResponseFailedReason } from "./generic-response-failed-reason";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrUpdatePublishingChannelBackgroundImageFailedReasonError
 */
export interface FailureResponseErrorReasonTypesStringOrUpdatePublishingChannelBackgroundImageFailedReasonError {
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrUpdatePublishingChannelBackgroundImageFailedReasonError
   */
  additionalErrorInformation?: string;
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrUpdatePublishingChannelBackgroundImageFailedReasonError
   */
  errorMessage?: string;
  /**
   *
   * @type {ErrorReasonTypesStringOrUpdatePublishingChannelBackgroundImageFailedReason | AuthFailedReason | GenericResponseFailedReason}
   * @memberof FailureResponseErrorReasonTypesStringOrUpdatePublishingChannelBackgroundImageFailedReasonError
   */
  reason:
    | ErrorReasonTypesStringOrUpdatePublishingChannelBackgroundImageFailedReason
    | AuthFailedReason
    | GenericResponseFailedReason;
}