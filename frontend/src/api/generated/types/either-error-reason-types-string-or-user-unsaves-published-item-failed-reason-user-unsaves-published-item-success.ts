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
import { FailureResponseErrorReasonTypesStringOrUserUnsavesPublishedItemFailedReason } from "./failure-response-error-reason-types-string-or-user-unsaves-published-item-failed-reason";
import { FailureResponseErrorReasonTypesStringOrUserUnsavesPublishedItemFailedReasonError } from "./failure-response-error-reason-types-string-or-user-unsaves-published-item-failed-reason-error";
import { SuccessResponseUserUnsavesPublishedItemSuccess } from "./success-response-user-unsaves-published-item-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrUserUnsavesPublishedItemFailedReasonUserUnsavesPublishedItemSuccess
 */
export interface EitherErrorReasonTypesStringOrUserUnsavesPublishedItemFailedReasonUserUnsavesPublishedItemSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrUserUnsavesPublishedItemFailedReasonUserUnsavesPublishedItemSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrUserUnsavesPublishedItemFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrUserUnsavesPublishedItemFailedReasonUserUnsavesPublishedItemSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrUserUnsavesPublishedItemFailedReasonError;
  /**
   *
   * @type {object}
   * @memberof EitherErrorReasonTypesStringOrUserUnsavesPublishedItemFailedReasonUserUnsavesPublishedItemSuccess
   */
  success: object;
}