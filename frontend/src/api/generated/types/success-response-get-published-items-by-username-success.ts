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
import { GetPublishedItemsByUsernameSuccess } from "./get-published-items-by-username-success";

/**
 *
 * @export
 * @interface SuccessResponseGetPublishedItemsByUsernameSuccess
 */
export interface SuccessResponseGetPublishedItemsByUsernameSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof SuccessResponseGetPublishedItemsByUsernameSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {GetPublishedItemsByUsernameSuccess}
   * @memberof SuccessResponseGetPublishedItemsByUsernameSuccess
   */
  success: GetPublishedItemsByUsernameSuccess;
}
