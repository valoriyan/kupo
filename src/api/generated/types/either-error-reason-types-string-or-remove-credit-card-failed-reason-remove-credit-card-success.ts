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
import { FailureResponseErrorReasonTypesStringOrRemoveCreditCardFailedReason } from "./failure-response-error-reason-types-string-or-remove-credit-card-failed-reason";
import { FailureResponseErrorReasonTypesStringOrRemoveCreditCardFailedReasonError } from "./failure-response-error-reason-types-string-or-remove-credit-card-failed-reason-error";
import { SuccessResponseRemoveCreditCardSuccess } from "./success-response-remove-credit-card-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrRemoveCreditCardFailedReasonRemoveCreditCardSuccess
 */
export interface EitherErrorReasonTypesStringOrRemoveCreditCardFailedReasonRemoveCreditCardSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrRemoveCreditCardFailedReasonRemoveCreditCardSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrRemoveCreditCardFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrRemoveCreditCardFailedReasonRemoveCreditCardSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrRemoveCreditCardFailedReasonError;
  /**
   *
   * @type {object}
   * @memberof EitherErrorReasonTypesStringOrRemoveCreditCardFailedReasonRemoveCreditCardSuccess
   */
  success: object;
}
