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
import { FailureResponseErrorReasonTypesStringOrGetUsersByUsernamesFailedReason } from "./failure-response-error-reason-types-string-or-get-users-by-usernames-failed-reason";
import { FailureResponseErrorReasonTypesStringOrGetUsersByUsernamesFailedReasonError } from "./failure-response-error-reason-types-string-or-get-users-by-usernames-failed-reason-error";
import { GetUsersByUsernamesSuccess } from "./get-users-by-usernames-success";
import { SuccessResponseGetUsersByUsernamesSuccess } from "./success-response-get-users-by-usernames-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrGetUsersByUsernamesFailedReasonGetUsersByUsernamesSuccess
 */
export interface EitherErrorReasonTypesStringOrGetUsersByUsernamesFailedReasonGetUsersByUsernamesSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrGetUsersByUsernamesFailedReasonGetUsersByUsernamesSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrGetUsersByUsernamesFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrGetUsersByUsernamesFailedReasonGetUsersByUsernamesSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrGetUsersByUsernamesFailedReasonError;
  /**
   *
   * @type {GetUsersByUsernamesSuccess}
   * @memberof EitherErrorReasonTypesStringOrGetUsersByUsernamesFailedReasonGetUsersByUsernamesSuccess
   */
  success: GetUsersByUsernamesSuccess;
}
