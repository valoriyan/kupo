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
import { ErrorReasonTypesStringOrGetFollowerRequestsFailedReason } from "./error-reason-types-string-or-get-follower-requests-failed-reason";
import { GenericResponseFailedReason } from "./generic-response-failed-reason";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrGetFollowerRequestsFailedReasonError
 */
export interface FailureResponseErrorReasonTypesStringOrGetFollowerRequestsFailedReasonError {
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrGetFollowerRequestsFailedReasonError
   */
  additionalErrorInformation?: string;
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrGetFollowerRequestsFailedReasonError
   */
  errorMessage?: string;
  /**
   *
   * @type {ErrorReasonTypesStringOrGetFollowerRequestsFailedReason | AuthFailedReason | GenericResponseFailedReason}
   * @memberof FailureResponseErrorReasonTypesStringOrGetFollowerRequestsFailedReasonError
   */
  reason:
    | ErrorReasonTypesStringOrGetFollowerRequestsFailedReason
    | AuthFailedReason
    | GenericResponseFailedReason;
}