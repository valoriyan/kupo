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
import { ErrorReasonTypesStringOrGetRecommendedPublishedItemsFailedReason } from "./error-reason-types-string-or-get-recommended-published-items-failed-reason";
import { GenericResponseFailedReason } from "./generic-response-failed-reason";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrGetRecommendedPublishedItemsFailedReasonError
 */
export interface FailureResponseErrorReasonTypesStringOrGetRecommendedPublishedItemsFailedReasonError {
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrGetRecommendedPublishedItemsFailedReasonError
   */
  additionalErrorInformation?: string;
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrGetRecommendedPublishedItemsFailedReasonError
   */
  errorMessage?: string;
  /**
   *
   * @type {ErrorReasonTypesStringOrGetRecommendedPublishedItemsFailedReason | AuthFailedReason | GenericResponseFailedReason}
   * @memberof FailureResponseErrorReasonTypesStringOrGetRecommendedPublishedItemsFailedReasonError
   */
  reason:
    | ErrorReasonTypesStringOrGetRecommendedPublishedItemsFailedReason
    | AuthFailedReason
    | GenericResponseFailedReason;
}