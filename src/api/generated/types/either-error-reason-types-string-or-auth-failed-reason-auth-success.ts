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

import { AuthSuccess } from "./auth-success";
import { EitherTypeSuccess } from "./either-type-success";
import { FailureResponseErrorReasonTypesStringOrAuthFailedReason } from "./failure-response-error-reason-types-string-or-auth-failed-reason";
import { FailureResponseErrorReasonTypesStringOrAuthFailedReasonError } from "./failure-response-error-reason-types-string-or-auth-failed-reason-error";
import { SuccessResponseAuthSuccess } from "./success-response-auth-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrAuthFailedReasonAuthSuccess
 */
export interface EitherErrorReasonTypesStringOrAuthFailedReasonAuthSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrAuthFailedReasonAuthSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrAuthFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrAuthFailedReasonAuthSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrAuthFailedReasonError;
  /**
   *
   * @type {AuthSuccess}
   * @memberof EitherErrorReasonTypesStringOrAuthFailedReasonAuthSuccess
   */
  success: AuthSuccess;
}
