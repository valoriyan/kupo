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

import { EitherTypeSuccess } from "./either-type-success";
import { FailureResponseResetPasswordFailedReason } from "./failure-response-reset-password-failed-reason";
import { FailureResponseResetPasswordFailedReasonError } from "./failure-response-reset-password-failed-reason-error";
import { SuccessResponseResetPasswordSuccess } from "./success-response-reset-password-success";

/**
 *
 * @export
 * @interface EitherResetPasswordFailedReasonResetPasswordSuccess
 */
export interface EitherResetPasswordFailedReasonResetPasswordSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherResetPasswordFailedReasonResetPasswordSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseResetPasswordFailedReasonError}
   * @memberof EitherResetPasswordFailedReasonResetPasswordSuccess
   */
  error: FailureResponseResetPasswordFailedReasonError;
  /**
   *
   * @type {object}
   * @memberof EitherResetPasswordFailedReasonResetPasswordSuccess
   */
  success: object;
}
