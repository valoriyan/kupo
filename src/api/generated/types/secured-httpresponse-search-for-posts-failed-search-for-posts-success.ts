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

import { FailedAuthResponse } from "./failed-auth-response";
import { SearchForPostsFailed } from "./search-for-posts-failed";
import { SearchForPostsSuccess } from "./search-for-posts-success";

/**
 *
 * @export
 * @interface SecuredHTTPResponseSearchForPostsFailedSearchForPostsSuccess
 */
export interface SecuredHTTPResponseSearchForPostsFailedSearchForPostsSuccess {
  /**
   *
   * @type {SearchForPostsFailed | FailedAuthResponse}
   * @memberof SecuredHTTPResponseSearchForPostsFailedSearchForPostsSuccess
   */
  error?: SearchForPostsFailed | FailedAuthResponse;
  /**
   *
   * @type {SearchForPostsSuccess}
   * @memberof SecuredHTTPResponseSearchForPostsFailedSearchForPostsSuccess
   */
  success?: SearchForPostsSuccess;
}
