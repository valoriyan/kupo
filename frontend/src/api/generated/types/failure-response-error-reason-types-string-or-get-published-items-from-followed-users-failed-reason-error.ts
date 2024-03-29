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
import { ErrorReasonTypesStringOrGetPublishedItemsFromFollowedUsersFailedReason } from "./error-reason-types-string-or-get-published-items-from-followed-users-failed-reason";
import { GenericResponseFailedReason } from "./generic-response-failed-reason";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrGetPublishedItemsFromFollowedUsersFailedReasonError
 */
export interface FailureResponseErrorReasonTypesStringOrGetPublishedItemsFromFollowedUsersFailedReasonError {
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrGetPublishedItemsFromFollowedUsersFailedReasonError
   */
  additionalErrorInformation?: string;
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrGetPublishedItemsFromFollowedUsersFailedReasonError
   */
  errorMessage?: string;
  /**
   *
   * @type {ErrorReasonTypesStringOrGetPublishedItemsFromFollowedUsersFailedReason | AuthFailedReason | GenericResponseFailedReason}
   * @memberof FailureResponseErrorReasonTypesStringOrGetPublishedItemsFromFollowedUsersFailedReasonError
   */
  reason:
    | ErrorReasonTypesStringOrGetPublishedItemsFromFollowedUsersFailedReason
    | AuthFailedReason
    | GenericResponseFailedReason;
}
