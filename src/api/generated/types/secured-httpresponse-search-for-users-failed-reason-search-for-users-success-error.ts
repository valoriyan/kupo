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

import { AuthFailedReason } from "./auth-failed-reason";
import { GenericResponseFailedReason } from "./generic-response-failed-reason";
import { SearchForUsersFailedReason } from "./search-for-users-failed-reason";

/**
 *
 * @export
 * @interface SecuredHTTPResponseSearchForUsersFailedReasonSearchForUsersSuccessError
 */
export interface SecuredHTTPResponseSearchForUsersFailedReasonSearchForUsersSuccessError {
  /**
   *
   * @type {string}
   * @memberof SecuredHTTPResponseSearchForUsersFailedReasonSearchForUsersSuccessError
   */
  additionalErrorInformation?: string;
  /**
   *
   * @type {string}
   * @memberof SecuredHTTPResponseSearchForUsersFailedReasonSearchForUsersSuccessError
   */
  errorMessage?: string;
  /**
   *
   * @type {SearchForUsersFailedReason | GenericResponseFailedReason | AuthFailedReason}
   * @memberof SecuredHTTPResponseSearchForUsersFailedReasonSearchForUsersSuccessError
   */
  reason: SearchForUsersFailedReason | GenericResponseFailedReason | AuthFailedReason;
}
