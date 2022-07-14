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

import { AuthFailedReason } from "./auth-failed-reason";
import { GenericResponseFailedReason } from "./generic-response-failed-reason";
import { ReadPageOfCommentsByPublishedItemIdFailedReason } from "./read-page-of-comments-by-published-item-id-failed-reason";

/**
 *
 * @export
 * @interface SecuredHTTPResponseReadPageOfCommentsByPublishedItemIdFailedReasonReadPageOfCommentsByPublishedItemIdSuccessError
 */
export interface SecuredHTTPResponseReadPageOfCommentsByPublishedItemIdFailedReasonReadPageOfCommentsByPublishedItemIdSuccessError {
  /**
   *
   * @type {string}
   * @memberof SecuredHTTPResponseReadPageOfCommentsByPublishedItemIdFailedReasonReadPageOfCommentsByPublishedItemIdSuccessError
   */
  additionalErrorInformation?: string;
  /**
   *
   * @type {string}
   * @memberof SecuredHTTPResponseReadPageOfCommentsByPublishedItemIdFailedReasonReadPageOfCommentsByPublishedItemIdSuccessError
   */
  errorMessage?: string;
  /**
   *
   * @type {ReadPageOfCommentsByPublishedItemIdFailedReason | GenericResponseFailedReason | AuthFailedReason}
   * @memberof SecuredHTTPResponseReadPageOfCommentsByPublishedItemIdFailedReasonReadPageOfCommentsByPublishedItemIdSuccessError
   */
  reason:
    | ReadPageOfCommentsByPublishedItemIdFailedReason
    | GenericResponseFailedReason
    | AuthFailedReason;
}
