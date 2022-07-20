/* tslint:disable */
/* eslint-disable */
/**
 * kupono-backend
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
import { ErrorReasonTypesStringOrGetPublishedItemsFromFollowedHashtagFailedReason } from "./error-reason-types-string-or-get-published-items-from-followed-hashtag-failed-reason";
import { GenericResponseFailedReason } from "./generic-response-failed-reason";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrGetPublishedItemsFromFollowedHashtagFailedReasonError
 */
export interface FailureResponseErrorReasonTypesStringOrGetPublishedItemsFromFollowedHashtagFailedReasonError {
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrGetPublishedItemsFromFollowedHashtagFailedReasonError
   */
  additionalErrorInformation?: string;
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrGetPublishedItemsFromFollowedHashtagFailedReasonError
   */
  errorMessage?: string;
  /**
   *
   * @type {ErrorReasonTypesStringOrGetPublishedItemsFromFollowedHashtagFailedReason | AuthFailedReason | GenericResponseFailedReason}
   * @memberof FailureResponseErrorReasonTypesStringOrGetPublishedItemsFromFollowedHashtagFailedReasonError
   */
  reason:
    | ErrorReasonTypesStringOrGetPublishedItemsFromFollowedHashtagFailedReason
    | AuthFailedReason
    | GenericResponseFailedReason;
}
