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
import { FailureResponseErrorReasonTypesStringOrGetPublishedItemByIdFailedReason } from "./failure-response-error-reason-types-string-or-get-published-item-by-id-failed-reason";
import { FailureResponseErrorReasonTypesStringOrGetPublishedItemByIdFailedReasonError } from "./failure-response-error-reason-types-string-or-get-published-item-by-id-failed-reason-error";
import { GetPublishedItemByIdSuccess } from "./get-published-item-by-id-success";
import { SuccessResponseGetPublishedItemByIdSuccess } from "./success-response-get-published-item-by-id-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrGetPublishedItemByIdFailedReasonGetPublishedItemByIdSuccess
 */
export interface EitherErrorReasonTypesStringOrGetPublishedItemByIdFailedReasonGetPublishedItemByIdSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrGetPublishedItemByIdFailedReasonGetPublishedItemByIdSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrGetPublishedItemByIdFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrGetPublishedItemByIdFailedReasonGetPublishedItemByIdSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrGetPublishedItemByIdFailedReasonError;
  /**
   *
   * @type {GetPublishedItemByIdSuccess}
   * @memberof EitherErrorReasonTypesStringOrGetPublishedItemByIdFailedReasonGetPublishedItemByIdSuccess
   */
  success: GetPublishedItemByIdSuccess;
}