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

/**
 *
 * @export
 * @interface SecuredHTTPResponseUserUnsavesPublishedItemFailedUserUnsavesPublishedItemSuccessError
 */
export interface SecuredHTTPResponseUserUnsavesPublishedItemFailedUserUnsavesPublishedItemSuccessError {
  /**
   *
   * @type {string}
   * @memberof SecuredHTTPResponseUserUnsavesPublishedItemFailedUserUnsavesPublishedItemSuccessError
   */
  additionalErrorInformation?: string;
  /**
   *
   * @type {string}
   * @memberof SecuredHTTPResponseUserUnsavesPublishedItemFailedUserUnsavesPublishedItemSuccessError
   */
  errorMessage?: string;
  /**
   *
   * @type {object | GenericResponseFailedReason | AuthFailedReason}
   * @memberof SecuredHTTPResponseUserUnsavesPublishedItemFailedUserUnsavesPublishedItemSuccessError
   */
  reason: object | GenericResponseFailedReason | AuthFailedReason;
}
