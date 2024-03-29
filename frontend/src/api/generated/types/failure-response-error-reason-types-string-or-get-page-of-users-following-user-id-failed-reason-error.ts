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
import { ErrorReasonTypesStringOrGetPageOfUsersFollowingUserIdFailedReason } from "./error-reason-types-string-or-get-page-of-users-following-user-id-failed-reason";
import { GenericResponseFailedReason } from "./generic-response-failed-reason";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrGetPageOfUsersFollowingUserIdFailedReasonError
 */
export interface FailureResponseErrorReasonTypesStringOrGetPageOfUsersFollowingUserIdFailedReasonError {
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrGetPageOfUsersFollowingUserIdFailedReasonError
   */
  additionalErrorInformation?: string;
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrGetPageOfUsersFollowingUserIdFailedReasonError
   */
  errorMessage?: string;
  /**
   *
   * @type {ErrorReasonTypesStringOrGetPageOfUsersFollowingUserIdFailedReason | AuthFailedReason | GenericResponseFailedReason}
   * @memberof FailureResponseErrorReasonTypesStringOrGetPageOfUsersFollowingUserIdFailedReasonError
   */
  reason:
    | ErrorReasonTypesStringOrGetPageOfUsersFollowingUserIdFailedReason
    | AuthFailedReason
    | GenericResponseFailedReason;
}
