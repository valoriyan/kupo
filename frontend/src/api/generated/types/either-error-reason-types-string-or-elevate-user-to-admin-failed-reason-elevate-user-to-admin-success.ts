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
import { FailureResponseErrorReasonTypesStringOrElevateUserToAdminFailedReason } from "./failure-response-error-reason-types-string-or-elevate-user-to-admin-failed-reason";
import { FailureResponseErrorReasonTypesStringOrElevateUserToAdminFailedReasonError } from "./failure-response-error-reason-types-string-or-elevate-user-to-admin-failed-reason-error";
import { SuccessResponseElevateUserToAdminSuccess } from "./success-response-elevate-user-to-admin-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrElevateUserToAdminFailedReasonElevateUserToAdminSuccess
 */
export interface EitherErrorReasonTypesStringOrElevateUserToAdminFailedReasonElevateUserToAdminSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrElevateUserToAdminFailedReasonElevateUserToAdminSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrElevateUserToAdminFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrElevateUserToAdminFailedReasonElevateUserToAdminSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrElevateUserToAdminFailedReasonError;
  /**
   *
   * @type {object}
   * @memberof EitherErrorReasonTypesStringOrElevateUserToAdminFailedReasonElevateUserToAdminSuccess
   */
  success: object;
}
