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
import { FailureResponseErrorReasonTypesStringOrCreatePublishedItemCommentFailedReasonError } from "./failure-response-error-reason-types-string-or-create-published-item-comment-failed-reason-error";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrCreatePublishedItemCommentFailedReason
 */
export interface FailureResponseErrorReasonTypesStringOrCreatePublishedItemCommentFailedReason {
  /**
   *
   * @type {EitherTypeFailure}
   * @memberof FailureResponseErrorReasonTypesStringOrCreatePublishedItemCommentFailedReason
   */
  type: EitherTypeFailure;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrCreatePublishedItemCommentFailedReasonError}
   * @memberof FailureResponseErrorReasonTypesStringOrCreatePublishedItemCommentFailedReason
   */
  error: FailureResponseErrorReasonTypesStringOrCreatePublishedItemCommentFailedReasonError;
}