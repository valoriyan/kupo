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
import { FailureResponseErrorReasonTypesStringOrGetUsersByIdsFailedReason } from "./failure-response-error-reason-types-string-or-get-users-by-ids-failed-reason";
import { FailureResponseErrorReasonTypesStringOrGetUsersByIdsFailedReasonError } from "./failure-response-error-reason-types-string-or-get-users-by-ids-failed-reason-error";
import { GetUsersByIdsSuccess } from "./get-users-by-ids-success";
import { SuccessResponseGetUsersByIdsSuccess } from "./success-response-get-users-by-ids-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrGetUsersByIdsFailedReasonGetUsersByIdsSuccess
 */
export interface EitherErrorReasonTypesStringOrGetUsersByIdsFailedReasonGetUsersByIdsSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrGetUsersByIdsFailedReasonGetUsersByIdsSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrGetUsersByIdsFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrGetUsersByIdsFailedReasonGetUsersByIdsSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrGetUsersByIdsFailedReasonError;
  /**
   *
   * @type {GetUsersByIdsSuccess}
   * @memberof EitherErrorReasonTypesStringOrGetUsersByIdsFailedReasonGetUsersByIdsSuccess
   */
  success: GetUsersByIdsSuccess;
}
