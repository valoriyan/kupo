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
import { FailureResponseCheckResetPasswordTokenValidityFailedReasonError } from "./failure-response-check-reset-password-token-validity-failed-reason-error";

/**
 *
 * @export
 * @interface FailureResponseCheckResetPasswordTokenValidityFailedReason
 */
export interface FailureResponseCheckResetPasswordTokenValidityFailedReason {
  /**
   *
   * @type {EitherTypeFailure}
   * @memberof FailureResponseCheckResetPasswordTokenValidityFailedReason
   */
  type: EitherTypeFailure;
  /**
   *
   * @type {FailureResponseCheckResetPasswordTokenValidityFailedReasonError}
   * @memberof FailureResponseCheckResetPasswordTokenValidityFailedReason
   */
  error: FailureResponseCheckResetPasswordTokenValidityFailedReasonError;
}
