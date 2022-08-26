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

import { AuthFailedReason } from "./auth-failed-reason";
import { ErrorReasonTypesStringOrMakeCreditCardPrimaryFailedReason } from "./error-reason-types-string-or-make-credit-card-primary-failed-reason";
import { GenericResponseFailedReason } from "./generic-response-failed-reason";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrMakeCreditCardPrimaryFailedReasonError
 */
export interface FailureResponseErrorReasonTypesStringOrMakeCreditCardPrimaryFailedReasonError {
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrMakeCreditCardPrimaryFailedReasonError
   */
  additionalErrorInformation?: string;
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrMakeCreditCardPrimaryFailedReasonError
   */
  errorMessage?: string;
  /**
   *
   * @type {ErrorReasonTypesStringOrMakeCreditCardPrimaryFailedReason | AuthFailedReason | GenericResponseFailedReason}
   * @memberof FailureResponseErrorReasonTypesStringOrMakeCreditCardPrimaryFailedReasonError
   */
  reason:
    | ErrorReasonTypesStringOrMakeCreditCardPrimaryFailedReason
    | AuthFailedReason
    | GenericResponseFailedReason;
}