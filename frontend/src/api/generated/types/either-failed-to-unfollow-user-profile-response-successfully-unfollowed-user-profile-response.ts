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

import { EitherTypeSuccess } from "./either-type-success";
import { FailureResponseFailedToUnfollowUserProfileResponse } from "./failure-response-failed-to-unfollow-user-profile-response";
import { FailureResponseFailedToUnfollowUserProfileResponseError } from "./failure-response-failed-to-unfollow-user-profile-response-error";
import { SuccessResponseSuccessfullyUnfollowedUserProfileResponse } from "./success-response-successfully-unfollowed-user-profile-response";

/**
 *
 * @export
 * @interface EitherFailedToUnfollowUserProfileResponseSuccessfullyUnfollowedUserProfileResponse
 */
export interface EitherFailedToUnfollowUserProfileResponseSuccessfullyUnfollowedUserProfileResponse {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherFailedToUnfollowUserProfileResponseSuccessfullyUnfollowedUserProfileResponse
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseFailedToUnfollowUserProfileResponseError}
   * @memberof EitherFailedToUnfollowUserProfileResponseSuccessfullyUnfollowedUserProfileResponse
   */
  error: FailureResponseFailedToUnfollowUserProfileResponseError;
  /**
   *
   * @type {object}
   * @memberof EitherFailedToUnfollowUserProfileResponseSuccessfullyUnfollowedUserProfileResponse
   */
  success: object;
}
