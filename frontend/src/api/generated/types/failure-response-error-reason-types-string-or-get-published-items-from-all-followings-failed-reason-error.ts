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
import { ErrorReasonTypesStringOrGetPublishedItemsFromAllFollowingsFailedReason } from "./error-reason-types-string-or-get-published-items-from-all-followings-failed-reason";
import { GenericResponseFailedReason } from "./generic-response-failed-reason";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrGetPublishedItemsFromAllFollowingsFailedReasonError
 */
export interface FailureResponseErrorReasonTypesStringOrGetPublishedItemsFromAllFollowingsFailedReasonError {
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrGetPublishedItemsFromAllFollowingsFailedReasonError
   */
  additionalErrorInformation?: string;
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrGetPublishedItemsFromAllFollowingsFailedReasonError
   */
  errorMessage?: string;
  /**
   *
   * @type {ErrorReasonTypesStringOrGetPublishedItemsFromAllFollowingsFailedReason | AuthFailedReason | GenericResponseFailedReason}
   * @memberof FailureResponseErrorReasonTypesStringOrGetPublishedItemsFromAllFollowingsFailedReasonError
   */
  reason:
    | ErrorReasonTypesStringOrGetPublishedItemsFromAllFollowingsFailedReason
    | AuthFailedReason
    | GenericResponseFailedReason;
}
