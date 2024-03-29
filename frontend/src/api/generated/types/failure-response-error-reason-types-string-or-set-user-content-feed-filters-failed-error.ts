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
import { ErrorReasonTypesStringOrSetUserContentFeedFiltersFailed } from "./error-reason-types-string-or-set-user-content-feed-filters-failed";
import { GenericResponseFailedReason } from "./generic-response-failed-reason";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrSetUserContentFeedFiltersFailedError
 */
export interface FailureResponseErrorReasonTypesStringOrSetUserContentFeedFiltersFailedError {
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrSetUserContentFeedFiltersFailedError
   */
  additionalErrorInformation?: string;
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrSetUserContentFeedFiltersFailedError
   */
  errorMessage?: string;
  /**
   *
   * @type {ErrorReasonTypesStringOrSetUserContentFeedFiltersFailed | AuthFailedReason | GenericResponseFailedReason}
   * @memberof FailureResponseErrorReasonTypesStringOrSetUserContentFeedFiltersFailedError
   */
  reason:
    | ErrorReasonTypesStringOrSetUserContentFeedFiltersFailed
    | AuthFailedReason
    | GenericResponseFailedReason;
}
