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
import { FailureResponseErrorReasonTypesStringOrElevateUserToAdminFailed } from "./failure-response-error-reason-types-string-or-elevate-user-to-admin-failed";
import { FailureResponseErrorReasonTypesStringOrElevateUserToAdminFailedError } from "./failure-response-error-reason-types-string-or-elevate-user-to-admin-failed-error";
import { SuccessResponseElevateUserToAdminSuccess } from "./success-response-elevate-user-to-admin-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrElevateUserToAdminFailedElevateUserToAdminSuccess
 */
export interface EitherErrorReasonTypesStringOrElevateUserToAdminFailedElevateUserToAdminSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrElevateUserToAdminFailedElevateUserToAdminSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrElevateUserToAdminFailedError}
   * @memberof EitherErrorReasonTypesStringOrElevateUserToAdminFailedElevateUserToAdminSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrElevateUserToAdminFailedError;
  /**
   *
   * @type {object}
   * @memberof EitherErrorReasonTypesStringOrElevateUserToAdminFailedElevateUserToAdminSuccess
   */
  success: object;
}
