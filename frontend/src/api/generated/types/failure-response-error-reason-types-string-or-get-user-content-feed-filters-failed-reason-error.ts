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
import { ErrorReasonTypesStringOrGetUserContentFeedFiltersFailedReason } from "./error-reason-types-string-or-get-user-content-feed-filters-failed-reason";
import { GenericResponseFailedReason } from "./generic-response-failed-reason";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrGetUserContentFeedFiltersFailedReasonError
 */
export interface FailureResponseErrorReasonTypesStringOrGetUserContentFeedFiltersFailedReasonError {
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrGetUserContentFeedFiltersFailedReasonError
   */
  additionalErrorInformation?: string;
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrGetUserContentFeedFiltersFailedReasonError
   */
  errorMessage?: string;
  /**
   *
   * @type {ErrorReasonTypesStringOrGetUserContentFeedFiltersFailedReason | AuthFailedReason | GenericResponseFailedReason}
   * @memberof FailureResponseErrorReasonTypesStringOrGetUserContentFeedFiltersFailedReasonError
   */
  reason:
    | ErrorReasonTypesStringOrGetUserContentFeedFiltersFailedReason
    | AuthFailedReason
    | GenericResponseFailedReason;
}
