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
import { FailureResponseErrorReasonTypesStringOrSetUserHashtagsFailedReason } from "./failure-response-error-reason-types-string-or-set-user-hashtags-failed-reason";
import { FailureResponseErrorReasonTypesStringOrSetUserHashtagsFailedReasonError } from "./failure-response-error-reason-types-string-or-set-user-hashtags-failed-reason-error";
import { SuccessResponseSetUserHashtagsSuccess } from "./success-response-set-user-hashtags-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrSetUserHashtagsFailedReasonSetUserHashtagsSuccess
 */
export interface EitherErrorReasonTypesStringOrSetUserHashtagsFailedReasonSetUserHashtagsSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrSetUserHashtagsFailedReasonSetUserHashtagsSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrSetUserHashtagsFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrSetUserHashtagsFailedReasonSetUserHashtagsSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrSetUserHashtagsFailedReasonError;
  /**
   *
   * @type {object}
   * @memberof EitherErrorReasonTypesStringOrSetUserHashtagsFailedReasonSetUserHashtagsSuccess
   */
  success: object;
}
