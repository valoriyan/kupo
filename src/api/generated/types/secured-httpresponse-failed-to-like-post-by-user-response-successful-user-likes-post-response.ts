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

/**
 *
 * @export
 * @interface SecuredHTTPResponseFailedToLikePostByUserResponseSuccessfulUserLikesPostResponse
 */
export interface SecuredHTTPResponseFailedToLikePostByUserResponseSuccessfulUserLikesPostResponse {
  /**
   *
   * @type {object | FailedAuthResponse}
   * @memberof SecuredHTTPResponseFailedToLikePostByUserResponseSuccessfulUserLikesPostResponse
   */
  error?: object | FailedAuthResponse;
  /**
   *
   * @type {object}
   * @memberof SecuredHTTPResponseFailedToLikePostByUserResponseSuccessfulUserLikesPostResponse
   */
  success?: object;
}
