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
import { GetClientUserProfileSuccess } from "./get-client-user-profile-success";

/**
 *
 * @export
 * @interface SuccessResponseGetClientUserProfileSuccess
 */
export interface SuccessResponseGetClientUserProfileSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof SuccessResponseGetClientUserProfileSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {GetClientUserProfileSuccess}
   * @memberof SuccessResponseGetClientUserProfileSuccess
   */
  success: GetClientUserProfileSuccess;
}
