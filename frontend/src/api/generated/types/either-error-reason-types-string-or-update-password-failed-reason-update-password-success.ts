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
import { FailureResponseErrorReasonTypesStringOrUpdatePasswordFailedReason } from "./failure-response-error-reason-types-string-or-update-password-failed-reason";
import { FailureResponseErrorReasonTypesStringOrUpdatePasswordFailedReasonError } from "./failure-response-error-reason-types-string-or-update-password-failed-reason-error";
import { SuccessResponseUpdatePasswordSuccess } from "./success-response-update-password-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrUpdatePasswordFailedReasonUpdatePasswordSuccess
 */
export interface EitherErrorReasonTypesStringOrUpdatePasswordFailedReasonUpdatePasswordSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrUpdatePasswordFailedReasonUpdatePasswordSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrUpdatePasswordFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrUpdatePasswordFailedReasonUpdatePasswordSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrUpdatePasswordFailedReasonError;
  /**
   *
   * @type {object}
   * @memberof EitherErrorReasonTypesStringOrUpdatePasswordFailedReasonUpdatePasswordSuccess
   */
  success: object;
}
