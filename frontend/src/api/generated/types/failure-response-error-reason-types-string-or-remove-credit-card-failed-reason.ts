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

import { EitherTypeFailure } from "./either-type-failure";
import { FailureResponseErrorReasonTypesStringOrRemoveCreditCardFailedReasonError } from "./failure-response-error-reason-types-string-or-remove-credit-card-failed-reason-error";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrRemoveCreditCardFailedReason
 */
export interface FailureResponseErrorReasonTypesStringOrRemoveCreditCardFailedReason {
  /**
   *
   * @type {EitherTypeFailure}
   * @memberof FailureResponseErrorReasonTypesStringOrRemoveCreditCardFailedReason
   */
  type: EitherTypeFailure;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrRemoveCreditCardFailedReasonError}
   * @memberof FailureResponseErrorReasonTypesStringOrRemoveCreditCardFailedReason
   */
  error: FailureResponseErrorReasonTypesStringOrRemoveCreditCardFailedReasonError;
}
