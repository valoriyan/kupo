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

import { EitherTypeFailure } from "./either-type-failure";
import { FailureResponseErrorReasonTypesStringOrGetPublishedItemsFromAllFollowingsFailedReasonError } from "./failure-response-error-reason-types-string-or-get-published-items-from-all-followings-failed-reason-error";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrGetPublishedItemsFromAllFollowingsFailedReason
 */
export interface FailureResponseErrorReasonTypesStringOrGetPublishedItemsFromAllFollowingsFailedReason {
  /**
   *
   * @type {EitherTypeFailure}
   * @memberof FailureResponseErrorReasonTypesStringOrGetPublishedItemsFromAllFollowingsFailedReason
   */
  type: EitherTypeFailure;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrGetPublishedItemsFromAllFollowingsFailedReasonError}
   * @memberof FailureResponseErrorReasonTypesStringOrGetPublishedItemsFromAllFollowingsFailedReason
   */
  error: FailureResponseErrorReasonTypesStringOrGetPublishedItemsFromAllFollowingsFailedReasonError;
}