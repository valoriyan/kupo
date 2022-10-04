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
import { ErrorReasonTypesStringOrUnblockUserFailedReason } from "./error-reason-types-string-or-unblock-user-failed-reason";
import { GenericResponseFailedReason } from "./generic-response-failed-reason";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrUnblockUserFailedReasonError
 */
export interface FailureResponseErrorReasonTypesStringOrUnblockUserFailedReasonError {
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrUnblockUserFailedReasonError
   */
  additionalErrorInformation?: string;
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrUnblockUserFailedReasonError
   */
  errorMessage?: string;
  /**
   *
   * @type {ErrorReasonTypesStringOrUnblockUserFailedReason | AuthFailedReason | GenericResponseFailedReason}
   * @memberof FailureResponseErrorReasonTypesStringOrUnblockUserFailedReasonError
   */
  reason:
    | ErrorReasonTypesStringOrUnblockUserFailedReason
    | AuthFailedReason
    | GenericResponseFailedReason;
}