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
import { FailedToGetUsersByIdsResponse } from "./failed-to-get-users-by-ids-response";
import { SuccessfullyGotUsersByIdsRequestBodyResponse } from "./successfully-got-users-by-ids-request-body-response";

/**
 *
 * @export
 * @interface SecuredHTTPResponseFailedToGetUsersByIdsResponseSuccessfullyGotUsersByIdsRequestBodyResponse
 */
export interface SecuredHTTPResponseFailedToGetUsersByIdsResponseSuccessfullyGotUsersByIdsRequestBodyResponse {
  /**
   *
   * @type {FailedToGetUsersByIdsResponse | FailedAuthResponse}
   * @memberof SecuredHTTPResponseFailedToGetUsersByIdsResponseSuccessfullyGotUsersByIdsRequestBodyResponse
   */
  error?: FailedToGetUsersByIdsResponse | FailedAuthResponse;
  /**
   *
   * @type {SuccessfullyGotUsersByIdsRequestBodyResponse}
   * @memberof SecuredHTTPResponseFailedToGetUsersByIdsResponseSuccessfullyGotUsersByIdsRequestBodyResponse
   */
  success?: SuccessfullyGotUsersByIdsRequestBodyResponse;
}
