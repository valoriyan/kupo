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
import { FailureResponseErrorReasonTypesStringOrRevokeFollowerFailedReason } from "./failure-response-error-reason-types-string-or-revoke-follower-failed-reason";
import { FailureResponseErrorReasonTypesStringOrRevokeFollowerFailedReasonError } from "./failure-response-error-reason-types-string-or-revoke-follower-failed-reason-error";
import { SuccessResponseRevokeFollowerSuccess } from "./success-response-revoke-follower-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrRevokeFollowerFailedReasonRevokeFollowerSuccess
 */
export interface EitherErrorReasonTypesStringOrRevokeFollowerFailedReasonRevokeFollowerSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrRevokeFollowerFailedReasonRevokeFollowerSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrRevokeFollowerFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrRevokeFollowerFailedReasonRevokeFollowerSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrRevokeFollowerFailedReasonError;
  /**
   *
   * @type {object}
   * @memberof EitherErrorReasonTypesStringOrRevokeFollowerFailedReasonRevokeFollowerSuccess
   */
  success: object;
}