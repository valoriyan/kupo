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
import { FailureResponseResolveFollowRequestFailedError } from "./failure-response-resolve-follow-request-failed-error";

/**
 *
 * @export
 * @interface FailureResponseResolveFollowRequestFailed
 */
export interface FailureResponseResolveFollowRequestFailed {
  /**
   *
   * @type {EitherTypeFailure}
   * @memberof FailureResponseResolveFollowRequestFailed
   */
  type: EitherTypeFailure;
  /**
   *
   * @type {FailureResponseResolveFollowRequestFailedError}
   * @memberof FailureResponseResolveFollowRequestFailed
   */
  error: FailureResponseResolveFollowRequestFailedError;
}
