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
import { ErrorReasonTypesStringOrRemoveModeratorFromPublishingChannelFailedReason } from "./error-reason-types-string-or-remove-moderator-from-publishing-channel-failed-reason";
import { GenericResponseFailedReason } from "./generic-response-failed-reason";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrRemoveModeratorFromPublishingChannelFailedReasonError
 */
export interface FailureResponseErrorReasonTypesStringOrRemoveModeratorFromPublishingChannelFailedReasonError {
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrRemoveModeratorFromPublishingChannelFailedReasonError
   */
  additionalErrorInformation?: string;
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrRemoveModeratorFromPublishingChannelFailedReasonError
   */
  errorMessage?: string;
  /**
   *
   * @type {ErrorReasonTypesStringOrRemoveModeratorFromPublishingChannelFailedReason | AuthFailedReason | GenericResponseFailedReason}
   * @memberof FailureResponseErrorReasonTypesStringOrRemoveModeratorFromPublishingChannelFailedReasonError
   */
  reason:
    | ErrorReasonTypesStringOrRemoveModeratorFromPublishingChannelFailedReason
    | AuthFailedReason
    | GenericResponseFailedReason;
}
