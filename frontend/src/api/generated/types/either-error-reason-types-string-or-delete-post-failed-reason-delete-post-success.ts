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
import { FailureResponseErrorReasonTypesStringOrDeletePostFailedReason } from "./failure-response-error-reason-types-string-or-delete-post-failed-reason";
import { FailureResponseErrorReasonTypesStringOrDeletePostFailedReasonError } from "./failure-response-error-reason-types-string-or-delete-post-failed-reason-error";
import { SuccessResponseDeletePostSuccess } from "./success-response-delete-post-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrDeletePostFailedReasonDeletePostSuccess
 */
export interface EitherErrorReasonTypesStringOrDeletePostFailedReasonDeletePostSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrDeletePostFailedReasonDeletePostSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrDeletePostFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrDeletePostFailedReasonDeletePostSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrDeletePostFailedReasonError;
  /**
   *
   * @type {object}
   * @memberof EitherErrorReasonTypesStringOrDeletePostFailedReasonDeletePostSuccess
   */
  success: object;
}
