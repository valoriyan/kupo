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

import { EitherTypeSuccess } from "./either-type-success";
import { FailureResponseGetFollowerRequestsFailed } from "./failure-response-get-follower-requests-failed";
import { FailureResponseGetFollowerRequestsFailedError } from "./failure-response-get-follower-requests-failed-error";
import { GetFollowerRequestsSuccess } from "./get-follower-requests-success";
import { SuccessResponseGetFollowerRequestsSuccess } from "./success-response-get-follower-requests-success";

/**
 *
 * @export
 * @interface EitherGetFollowerRequestsFailedGetFollowerRequestsSuccess
 */
export interface EitherGetFollowerRequestsFailedGetFollowerRequestsSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherGetFollowerRequestsFailedGetFollowerRequestsSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseGetFollowerRequestsFailedError}
   * @memberof EitherGetFollowerRequestsFailedGetFollowerRequestsSuccess
   */
  error: FailureResponseGetFollowerRequestsFailedError;
  /**
   *
   * @type {GetFollowerRequestsSuccess}
   * @memberof EitherGetFollowerRequestsFailedGetFollowerRequestsSuccess
   */
  success: GetFollowerRequestsSuccess;
}
