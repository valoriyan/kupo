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
import { FailureResponseErrorReasonTypesStringOrRemoveUserLikeFromPublishedItemFailedReason } from "./failure-response-error-reason-types-string-or-remove-user-like-from-published-item-failed-reason";
import { FailureResponseErrorReasonTypesStringOrRemoveUserLikeFromPublishedItemFailedReasonError } from "./failure-response-error-reason-types-string-or-remove-user-like-from-published-item-failed-reason-error";
import { SuccessResponseRemoveUserLikeFromPublishedItemSuccess } from "./success-response-remove-user-like-from-published-item-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrRemoveUserLikeFromPublishedItemFailedReasonRemoveUserLikeFromPublishedItemSuccess
 */
export interface EitherErrorReasonTypesStringOrRemoveUserLikeFromPublishedItemFailedReasonRemoveUserLikeFromPublishedItemSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrRemoveUserLikeFromPublishedItemFailedReasonRemoveUserLikeFromPublishedItemSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrRemoveUserLikeFromPublishedItemFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrRemoveUserLikeFromPublishedItemFailedReasonRemoveUserLikeFromPublishedItemSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrRemoveUserLikeFromPublishedItemFailedReasonError;
  /**
   *
   * @type {object}
   * @memberof EitherErrorReasonTypesStringOrRemoveUserLikeFromPublishedItemFailedReasonRemoveUserLikeFromPublishedItemSuccess
   */
  success: object;
}
