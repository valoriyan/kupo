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

import { EitherTypeSuccess } from "./either-type-success";
import { FailureResponseErrorReasonTypesStringOrGetUserContentFeedFiltersFailedReason } from "./failure-response-error-reason-types-string-or-get-user-content-feed-filters-failed-reason";
import { FailureResponseErrorReasonTypesStringOrGetUserContentFeedFiltersFailedReasonError } from "./failure-response-error-reason-types-string-or-get-user-content-feed-filters-failed-reason-error";
import { GetUserContentFeedFiltersSuccess } from "./get-user-content-feed-filters-success";
import { SuccessResponseGetUserContentFeedFiltersSuccess } from "./success-response-get-user-content-feed-filters-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrGetUserContentFeedFiltersFailedReasonGetUserContentFeedFiltersSuccess
 */
export interface EitherErrorReasonTypesStringOrGetUserContentFeedFiltersFailedReasonGetUserContentFeedFiltersSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrGetUserContentFeedFiltersFailedReasonGetUserContentFeedFiltersSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrGetUserContentFeedFiltersFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrGetUserContentFeedFiltersFailedReasonGetUserContentFeedFiltersSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrGetUserContentFeedFiltersFailedReasonError;
  /**
   *
   * @type {GetUserContentFeedFiltersSuccess}
   * @memberof EitherErrorReasonTypesStringOrGetUserContentFeedFiltersFailedReasonGetUserContentFeedFiltersSuccess
   */
  success: GetUserContentFeedFiltersSuccess;
}