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
import { SearchForPostsFailedReason } from "./search-for-posts-failed-reason";

/**
 *
 * @export
 * @interface SecuredHTTPResponseSearchForPostsFailedReasonSearchForPostsSuccessError
 */
export interface SecuredHTTPResponseSearchForPostsFailedReasonSearchForPostsSuccessError {
  /**
   *
   * @type {string}
   * @memberof SecuredHTTPResponseSearchForPostsFailedReasonSearchForPostsSuccessError
   */
  additionalErrorInformation?: string;
  /**
   *
   * @type {string}
   * @memberof SecuredHTTPResponseSearchForPostsFailedReasonSearchForPostsSuccessError
   */
  errorMessage?: string;
  /**
   *
   * @type {SearchForPostsFailedReason | GenericResponseFailedReason | AuthFailedReason}
   * @memberof SecuredHTTPResponseSearchForPostsFailedReasonSearchForPostsSuccessError
   */
  reason: SearchForPostsFailedReason | GenericResponseFailedReason | AuthFailedReason;
}
