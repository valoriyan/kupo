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
import { FailureResponseErrorReasonTypesStringOrSearchForPostsFailedReason } from "./failure-response-error-reason-types-string-or-search-for-posts-failed-reason";
import { FailureResponseErrorReasonTypesStringOrSearchForPostsFailedReasonError } from "./failure-response-error-reason-types-string-or-search-for-posts-failed-reason-error";
import { SearchForPostsSuccess } from "./search-for-posts-success";
import { SuccessResponseSearchForPostsSuccess } from "./success-response-search-for-posts-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrSearchForPostsFailedReasonSearchForPostsSuccess
 */
export interface EitherErrorReasonTypesStringOrSearchForPostsFailedReasonSearchForPostsSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrSearchForPostsFailedReasonSearchForPostsSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrSearchForPostsFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrSearchForPostsFailedReasonSearchForPostsSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrSearchForPostsFailedReasonError;
  /**
   *
   * @type {SearchForPostsSuccess}
   * @memberof EitherErrorReasonTypesStringOrSearchForPostsFailedReasonSearchForPostsSuccess
   */
  success: SearchForPostsSuccess;
}
