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

import { EitherTypeFailure } from "./either-type-failure";
import { FailureResponseFollowUserFailedError } from "./failure-response-follow-user-failed-error";

/**
 *
 * @export
 * @interface FailureResponseFollowUserFailed
 */
export interface FailureResponseFollowUserFailed {
  /**
   *
   * @type {EitherTypeFailure}
   * @memberof FailureResponseFollowUserFailed
   */
  type: EitherTypeFailure;
  /**
   *
   * @type {FailureResponseFollowUserFailedError}
   * @memberof FailureResponseFollowUserFailed
   */
  error: FailureResponseFollowUserFailedError;
}
