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
import { ErrorReasonTypesStringOrIsPublishingChannelNameValidFailedReason } from "./error-reason-types-string-or-is-publishing-channel-name-valid-failed-reason";
import { GenericResponseFailedReason } from "./generic-response-failed-reason";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrIsPublishingChannelNameValidFailedReasonError
 */
export interface FailureResponseErrorReasonTypesStringOrIsPublishingChannelNameValidFailedReasonError {
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrIsPublishingChannelNameValidFailedReasonError
   */
  additionalErrorInformation?: string;
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrIsPublishingChannelNameValidFailedReasonError
   */
  errorMessage?: string;
  /**
   *
   * @type {ErrorReasonTypesStringOrIsPublishingChannelNameValidFailedReason | AuthFailedReason | GenericResponseFailedReason}
   * @memberof FailureResponseErrorReasonTypesStringOrIsPublishingChannelNameValidFailedReasonError
   */
  reason:
    | ErrorReasonTypesStringOrIsPublishingChannelNameValidFailedReason
    | AuthFailedReason
    | GenericResponseFailedReason;
}
