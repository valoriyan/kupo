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
import { ErrorReasonTypesStringOrSearchUserProfilesByUsernameFailedReason } from "./error-reason-types-string-or-search-user-profiles-by-username-failed-reason";
import { GenericResponseFailedReason } from "./generic-response-failed-reason";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrSearchUserProfilesByUsernameFailedReasonError
 */
export interface FailureResponseErrorReasonTypesStringOrSearchUserProfilesByUsernameFailedReasonError {
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrSearchUserProfilesByUsernameFailedReasonError
   */
  additionalErrorInformation?: string;
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrSearchUserProfilesByUsernameFailedReasonError
   */
  errorMessage?: string;
  /**
   *
   * @type {ErrorReasonTypesStringOrSearchUserProfilesByUsernameFailedReason | AuthFailedReason | GenericResponseFailedReason}
   * @memberof FailureResponseErrorReasonTypesStringOrSearchUserProfilesByUsernameFailedReasonError
   */
  reason:
    | ErrorReasonTypesStringOrSearchUserProfilesByUsernameFailedReason
    | AuthFailedReason
    | GenericResponseFailedReason;
}
