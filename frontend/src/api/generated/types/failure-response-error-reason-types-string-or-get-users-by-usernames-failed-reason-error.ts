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
import { ErrorReasonTypesStringOrGetUsersByUsernamesFailedReason } from "./error-reason-types-string-or-get-users-by-usernames-failed-reason";
import { GenericResponseFailedReason } from "./generic-response-failed-reason";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrGetUsersByUsernamesFailedReasonError
 */
export interface FailureResponseErrorReasonTypesStringOrGetUsersByUsernamesFailedReasonError {
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrGetUsersByUsernamesFailedReasonError
   */
  additionalErrorInformation?: string;
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrGetUsersByUsernamesFailedReasonError
   */
  errorMessage?: string;
  /**
   *
   * @type {ErrorReasonTypesStringOrGetUsersByUsernamesFailedReason | AuthFailedReason | GenericResponseFailedReason}
   * @memberof FailureResponseErrorReasonTypesStringOrGetUsersByUsernamesFailedReasonError
   */
  reason:
    | ErrorReasonTypesStringOrGetUsersByUsernamesFailedReason
    | AuthFailedReason
    | GenericResponseFailedReason;
}