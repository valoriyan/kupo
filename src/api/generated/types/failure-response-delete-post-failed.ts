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
import { FailureResponseDeletePostFailedError } from "./failure-response-delete-post-failed-error";

/**
 *
 * @export
 * @interface FailureResponseDeletePostFailed
 */
export interface FailureResponseDeletePostFailed {
  /**
   *
   * @type {EitherTypeFailure}
   * @memberof FailureResponseDeletePostFailed
   */
  type: EitherTypeFailure;
  /**
   *
   * @type {FailureResponseDeletePostFailedError}
   * @memberof FailureResponseDeletePostFailed
   */
  error: FailureResponseDeletePostFailedError;
}
