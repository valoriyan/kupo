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
import { FailedtoGetPageOfPostsPaginationResponse } from "./failedto-get-page-of-posts-pagination-response";
import { SuccessfulGetPageOfPostsPaginationResponse } from "./successful-get-page-of-posts-pagination-response";

/**
 *
 * @export
 * @interface SecuredHTTPResponseFailedtoGetPageOfPostsPaginationResponseSuccessfulGetPageOfPostsPaginationResponse
 */
export interface SecuredHTTPResponseFailedtoGetPageOfPostsPaginationResponseSuccessfulGetPageOfPostsPaginationResponse {
  /**
   *
   * @type {FailedtoGetPageOfPostsPaginationResponse | FailedAuthResponse}
   * @memberof SecuredHTTPResponseFailedtoGetPageOfPostsPaginationResponseSuccessfulGetPageOfPostsPaginationResponse
   */
  error?: FailedtoGetPageOfPostsPaginationResponse | FailedAuthResponse;
  /**
   *
   * @type {SuccessfulGetPageOfPostsPaginationResponse}
   * @memberof SecuredHTTPResponseFailedtoGetPageOfPostsPaginationResponseSuccessfulGetPageOfPostsPaginationResponse
   */
  success?: SuccessfulGetPageOfPostsPaginationResponse;
}
