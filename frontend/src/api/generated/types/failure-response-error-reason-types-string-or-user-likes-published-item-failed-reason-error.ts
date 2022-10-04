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
import { ErrorReasonTypesStringOrUserLikesPublishedItemFailedReason } from "./error-reason-types-string-or-user-likes-published-item-failed-reason";
import { GenericResponseFailedReason } from "./generic-response-failed-reason";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrUserLikesPublishedItemFailedReasonError
 */
export interface FailureResponseErrorReasonTypesStringOrUserLikesPublishedItemFailedReasonError {
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrUserLikesPublishedItemFailedReasonError
   */
  additionalErrorInformation?: string;
  /**
   *
   * @type {string}
   * @memberof FailureResponseErrorReasonTypesStringOrUserLikesPublishedItemFailedReasonError
   */
  errorMessage?: string;
  /**
   *
   * @type {ErrorReasonTypesStringOrUserLikesPublishedItemFailedReason | AuthFailedReason | GenericResponseFailedReason}
   * @memberof FailureResponseErrorReasonTypesStringOrUserLikesPublishedItemFailedReasonError
   */
  reason:
    | ErrorReasonTypesStringOrUserLikesPublishedItemFailedReason
    | AuthFailedReason
    | GenericResponseFailedReason;
}