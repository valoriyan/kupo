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
import { FailureResponseErrorReasonTypesStringOrGetPasswordResetEmailFailed } from "./failure-response-error-reason-types-string-or-get-password-reset-email-failed";
import { FailureResponseErrorReasonTypesStringOrGetPasswordResetEmailFailedError } from "./failure-response-error-reason-types-string-or-get-password-reset-email-failed-error";
import { SuccessResponseGetPasswordResetEmailSuccess } from "./success-response-get-password-reset-email-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrGetPasswordResetEmailFailedGetPasswordResetEmailSuccess
 */
export interface EitherErrorReasonTypesStringOrGetPasswordResetEmailFailedGetPasswordResetEmailSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrGetPasswordResetEmailFailedGetPasswordResetEmailSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrGetPasswordResetEmailFailedError}
   * @memberof EitherErrorReasonTypesStringOrGetPasswordResetEmailFailedGetPasswordResetEmailSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrGetPasswordResetEmailFailedError;
  /**
   *
   * @type {object}
   * @memberof EitherErrorReasonTypesStringOrGetPasswordResetEmailFailedGetPasswordResetEmailSuccess
   */
  success: object;
}
