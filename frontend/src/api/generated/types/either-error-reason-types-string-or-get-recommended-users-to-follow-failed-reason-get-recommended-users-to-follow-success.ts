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
import { FailureResponseErrorReasonTypesStringOrGetRecommendedUsersToFollowFailedReason } from "./failure-response-error-reason-types-string-or-get-recommended-users-to-follow-failed-reason";
import { FailureResponseErrorReasonTypesStringOrGetRecommendedUsersToFollowFailedReasonError } from "./failure-response-error-reason-types-string-or-get-recommended-users-to-follow-failed-reason-error";
import { GetRecommendedUsersToFollowSuccess } from "./get-recommended-users-to-follow-success";
import { SuccessResponseGetRecommendedUsersToFollowSuccess } from "./success-response-get-recommended-users-to-follow-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrGetRecommendedUsersToFollowFailedReasonGetRecommendedUsersToFollowSuccess
 */
export interface EitherErrorReasonTypesStringOrGetRecommendedUsersToFollowFailedReasonGetRecommendedUsersToFollowSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrGetRecommendedUsersToFollowFailedReasonGetRecommendedUsersToFollowSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrGetRecommendedUsersToFollowFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrGetRecommendedUsersToFollowFailedReasonGetRecommendedUsersToFollowSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrGetRecommendedUsersToFollowFailedReasonError;
  /**
   *
   * @type {GetRecommendedUsersToFollowSuccess}
   * @memberof EitherErrorReasonTypesStringOrGetRecommendedUsersToFollowFailedReasonGetRecommendedUsersToFollowSuccess
   */
  success: GetRecommendedUsersToFollowSuccess;
}
