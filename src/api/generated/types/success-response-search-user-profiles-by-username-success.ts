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

import { EitherTypeSuccess } from "./either-type-success";
import { SearchUserProfilesByUsernameSuccess } from "./search-user-profiles-by-username-success";

/**
 *
 * @export
 * @interface SuccessResponseSearchUserProfilesByUsernameSuccess
 */
export interface SuccessResponseSearchUserProfilesByUsernameSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof SuccessResponseSearchUserProfilesByUsernameSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {SearchUserProfilesByUsernameSuccess}
   * @memberof SuccessResponseSearchUserProfilesByUsernameSuccess
   */
  success: SearchUserProfilesByUsernameSuccess;
}
