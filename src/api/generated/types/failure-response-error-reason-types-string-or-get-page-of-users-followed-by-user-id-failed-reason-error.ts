/* tslint:disable */
/* eslint-disable */
/**
 * kupono-backend
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
import { ErrorReasonTypesStringOrGetPageOfUsersFollowedByUserIdFailedReason } from "./error-reason-types-string-or-get-page-of-users-followed-by-user-id-failed-reason";
import { GenericResponseFailedReason } from "./generic-response-failed-reason";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrGetPageOfUsersFollowedByUserIdFailedReasonError
 */
export interface FailureResponseErrorReasonTypesStringOrGetPageOfUsersFollowedByUserIdFailedReasonError {
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrGetPageOfUsersFollowedByUserIdFailedReasonError
   */
  additionalErrorInformation?: string;
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrGetPageOfUsersFollowedByUserIdFailedReasonError
   */
  errorMessage?: string;
  /**
   *
   * @type {ErrorReasonTypesStringOrGetPageOfUsersFollowedByUserIdFailedReason | AuthFailedReason | GenericResponseFailedReason}
   * @memberof FailureResponseErrorReasonTypesStringOrGetPageOfUsersFollowedByUserIdFailedReasonError
   */
  reason:
    | ErrorReasonTypesStringOrGetPageOfUsersFollowedByUserIdFailedReason
    | AuthFailedReason
    | GenericResponseFailedReason;
}
