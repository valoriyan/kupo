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
import { FailureResponseErrorReasonTypesStringOrResetPasswordFailedReason } from "./failure-response-error-reason-types-string-or-reset-password-failed-reason";
import { FailureResponseErrorReasonTypesStringOrResetPasswordFailedReasonError } from "./failure-response-error-reason-types-string-or-reset-password-failed-reason-error";
import { SuccessResponseResetPasswordSuccess } from "./success-response-reset-password-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrResetPasswordFailedReasonResetPasswordSuccess
 */
export interface EitherErrorReasonTypesStringOrResetPasswordFailedReasonResetPasswordSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrResetPasswordFailedReasonResetPasswordSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrResetPasswordFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrResetPasswordFailedReasonResetPasswordSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrResetPasswordFailedReasonError;
  /**
   *
   * @type {object}
   * @memberof EitherErrorReasonTypesStringOrResetPasswordFailedReasonResetPasswordSuccess
   */
  success: object;
}