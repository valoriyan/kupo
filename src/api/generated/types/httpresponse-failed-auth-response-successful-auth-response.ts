/* tslint:disable */
/* eslint-disable */
/**
 * playhouse-backend-2
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { FailedAuthResponse } from "./failed-auth-response";
import { SuccessfulAuthResponse } from "./successful-auth-response";

/**
 *
 * @export
 * @interface HTTPResponseFailedAuthResponseSuccessfulAuthResponse
 */
export interface HTTPResponseFailedAuthResponseSuccessfulAuthResponse {
  /**
   *
   * @type {FailedAuthResponse}
   * @memberof HTTPResponseFailedAuthResponseSuccessfulAuthResponse
   */
  error?: FailedAuthResponse;
  /**
   *
   * @type {SuccessfulAuthResponse}
   * @memberof HTTPResponseFailedAuthResponseSuccessfulAuthResponse
   */
  success?: SuccessfulAuthResponse;
}
