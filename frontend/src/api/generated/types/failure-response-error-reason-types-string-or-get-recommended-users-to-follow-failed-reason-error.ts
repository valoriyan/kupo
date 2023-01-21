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

import { AuthFailedReason } from "./auth-failed-reason";
import { ErrorReasonTypesStringOrGetRecommendedUsersToFollowFailedReason } from "./error-reason-types-string-or-get-recommended-users-to-follow-failed-reason";
import { GenericResponseFailedReason } from "./generic-response-failed-reason";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrGetRecommendedUsersToFollowFailedReasonError
 */
export interface FailureResponseErrorReasonTypesStringOrGetRecommendedUsersToFollowFailedReasonError {
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrGetRecommendedUsersToFollowFailedReasonError
   */
  additionalErrorInformation?: string;
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrGetRecommendedUsersToFollowFailedReasonError
   */
  errorMessage?: string;
  /**
   *
   * @type {ErrorReasonTypesStringOrGetRecommendedUsersToFollowFailedReason | AuthFailedReason | GenericResponseFailedReason}
   * @memberof FailureResponseErrorReasonTypesStringOrGetRecommendedUsersToFollowFailedReasonError
   */
  reason:
    | ErrorReasonTypesStringOrGetRecommendedUsersToFollowFailedReason
    | AuthFailedReason
    | GenericResponseFailedReason;
}
