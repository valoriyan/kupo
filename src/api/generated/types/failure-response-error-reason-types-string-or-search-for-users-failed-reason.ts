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

import { EitherTypeFailure } from "./either-type-failure";
import { FailureResponseErrorReasonTypesStringOrSearchForUsersFailedReasonError } from "./failure-response-error-reason-types-string-or-search-for-users-failed-reason-error";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrSearchForUsersFailedReason
 */
export interface FailureResponseErrorReasonTypesStringOrSearchForUsersFailedReason {
  /**
   *
   * @type {EitherTypeFailure}
   * @memberof FailureResponseErrorReasonTypesStringOrSearchForUsersFailedReason
   */
  type: EitherTypeFailure;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrSearchForUsersFailedReasonError}
   * @memberof FailureResponseErrorReasonTypesStringOrSearchForUsersFailedReason
   */
  error: FailureResponseErrorReasonTypesStringOrSearchForUsersFailedReasonError;
}
