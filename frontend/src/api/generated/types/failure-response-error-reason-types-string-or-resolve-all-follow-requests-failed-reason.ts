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
import { FailureResponseErrorReasonTypesStringOrResolveAllFollowRequestsFailedReasonError } from "./failure-response-error-reason-types-string-or-resolve-all-follow-requests-failed-reason-error";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrResolveAllFollowRequestsFailedReason
 */
export interface FailureResponseErrorReasonTypesStringOrResolveAllFollowRequestsFailedReason {
  /**
   *
   * @type {EitherTypeFailure}
   * @memberof FailureResponseErrorReasonTypesStringOrResolveAllFollowRequestsFailedReason
   */
  type: EitherTypeFailure;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrResolveAllFollowRequestsFailedReasonError}
   * @memberof FailureResponseErrorReasonTypesStringOrResolveAllFollowRequestsFailedReason
   */
  error: FailureResponseErrorReasonTypesStringOrResolveAllFollowRequestsFailedReasonError;
}
