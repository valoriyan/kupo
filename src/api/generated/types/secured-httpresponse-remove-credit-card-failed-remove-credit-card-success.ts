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

import { AuthFailed } from "./auth-failed";

/**
 *
 * @export
 * @interface SecuredHTTPResponseRemoveCreditCardFailedRemoveCreditCardSuccess
 */
export interface SecuredHTTPResponseRemoveCreditCardFailedRemoveCreditCardSuccess {
  /**
   *
   * @type {object | AuthFailed}
   * @memberof SecuredHTTPResponseRemoveCreditCardFailedRemoveCreditCardSuccess
   */
  error?: object | AuthFailed;
  /**
   *
   * @type {object}
   * @memberof SecuredHTTPResponseRemoveCreditCardFailedRemoveCreditCardSuccess
   */
  success?: object;
}
