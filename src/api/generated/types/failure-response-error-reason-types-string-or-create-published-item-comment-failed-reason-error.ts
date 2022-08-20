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

import { AuthFailedReason } from "./auth-failed-reason";
import { ErrorReasonTypesStringOrCreatePublishedItemCommentFailedReason } from "./error-reason-types-string-or-create-published-item-comment-failed-reason";
import { GenericResponseFailedReason } from "./generic-response-failed-reason";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrCreatePublishedItemCommentFailedReasonError
 */
export interface FailureResponseErrorReasonTypesStringOrCreatePublishedItemCommentFailedReasonError {
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrCreatePublishedItemCommentFailedReasonError
   */
  additionalErrorInformation?: string;
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrCreatePublishedItemCommentFailedReasonError
   */
  errorMessage?: string;
  /**
   *
   * @type {ErrorReasonTypesStringOrCreatePublishedItemCommentFailedReason | AuthFailedReason | GenericResponseFailedReason}
   * @memberof FailureResponseErrorReasonTypesStringOrCreatePublishedItemCommentFailedReasonError
   */
  reason:
    | ErrorReasonTypesStringOrCreatePublishedItemCommentFailedReason
    | AuthFailedReason
    | GenericResponseFailedReason;
}
