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
import { FailureResponseErrorReasonTypesStringOrGetPageOfUsersFollowingUserIdFailedReasonError } from "./failure-response-error-reason-types-string-or-get-page-of-users-following-user-id-failed-reason-error";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrGetPageOfUsersFollowingUserIdFailedReason
 */
export interface FailureResponseErrorReasonTypesStringOrGetPageOfUsersFollowingUserIdFailedReason {
  /**
   *
   * @type {EitherTypeFailure}
   * @memberof FailureResponseErrorReasonTypesStringOrGetPageOfUsersFollowingUserIdFailedReason
   */
  type: EitherTypeFailure;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrGetPageOfUsersFollowingUserIdFailedReasonError}
   * @memberof FailureResponseErrorReasonTypesStringOrGetPageOfUsersFollowingUserIdFailedReason
   */
  error: FailureResponseErrorReasonTypesStringOrGetPageOfUsersFollowingUserIdFailedReasonError;
}
