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
import { FailureResponseSetUserHashtagsFailedError } from "./failure-response-set-user-hashtags-failed-error";

/**
 *
 * @export
 * @interface FailureResponseSetUserHashtagsFailed
 */
export interface FailureResponseSetUserHashtagsFailed {
  /**
   *
   * @type {EitherTypeFailure}
   * @memberof FailureResponseSetUserHashtagsFailed
   */
  type: EitherTypeFailure;
  /**
   *
   * @type {FailureResponseSetUserHashtagsFailedError}
   * @memberof FailureResponseSetUserHashtagsFailed
   */
  error: FailureResponseSetUserHashtagsFailedError;
}
