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
import { FailureResponseErrorReasonTypesStringOrSetUserContentFeedFiltersFailedReasonError } from "./failure-response-error-reason-types-string-or-set-user-content-feed-filters-failed-reason-error";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrSetUserContentFeedFiltersFailedReason
 */
export interface FailureResponseErrorReasonTypesStringOrSetUserContentFeedFiltersFailedReason {
  /**
   *
   * @type {EitherTypeFailure}
   * @memberof FailureResponseErrorReasonTypesStringOrSetUserContentFeedFiltersFailedReason
   */
  type: EitherTypeFailure;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrSetUserContentFeedFiltersFailedReasonError}
   * @memberof FailureResponseErrorReasonTypesStringOrSetUserContentFeedFiltersFailedReason
   */
  error: FailureResponseErrorReasonTypesStringOrSetUserContentFeedFiltersFailedReasonError;
}