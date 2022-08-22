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
import { ErrorReasonTypesStringOrGetPageOfAllPublishedItemsFailedReason } from "./error-reason-types-string-or-get-page-of-all-published-items-failed-reason";
import { GenericResponseFailedReason } from "./generic-response-failed-reason";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrGetPageOfAllPublishedItemsFailedReasonError
 */
export interface FailureResponseErrorReasonTypesStringOrGetPageOfAllPublishedItemsFailedReasonError {
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrGetPageOfAllPublishedItemsFailedReasonError
   */
  additionalErrorInformation?: string;
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrGetPageOfAllPublishedItemsFailedReasonError
   */
  errorMessage?: string;
  /**
   *
   * @type {ErrorReasonTypesStringOrGetPageOfAllPublishedItemsFailedReason | AuthFailedReason | GenericResponseFailedReason}
   * @memberof FailureResponseErrorReasonTypesStringOrGetPageOfAllPublishedItemsFailedReasonError
   */
  reason:
    | ErrorReasonTypesStringOrGetPageOfAllPublishedItemsFailedReason
    | AuthFailedReason
    | GenericResponseFailedReason;
}
