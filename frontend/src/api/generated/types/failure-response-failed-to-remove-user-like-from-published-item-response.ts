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
import { FailureResponseFailedToRemoveUserLikeFromPublishedItemResponseError } from "./failure-response-failed-to-remove-user-like-from-published-item-response-error";

/**
 *
 * @export
 * @interface FailureResponseFailedToRemoveUserLikeFromPublishedItemResponse
 */
export interface FailureResponseFailedToRemoveUserLikeFromPublishedItemResponse {
  /**
   *
   * @type {EitherTypeFailure}
   * @memberof FailureResponseFailedToRemoveUserLikeFromPublishedItemResponse
   */
  type: EitherTypeFailure;
  /**
   *
   * @type {FailureResponseFailedToRemoveUserLikeFromPublishedItemResponseError}
   * @memberof FailureResponseFailedToRemoveUserLikeFromPublishedItemResponse
   */
  error: FailureResponseFailedToRemoveUserLikeFromPublishedItemResponseError;
}