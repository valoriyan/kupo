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
import { GetPageOfUsersFollowedByUserIdSuccess } from "./get-page-of-users-followed-by-user-id-success";

/**
 *
 * @export
 * @interface SuccessResponseGetPageOfUsersFollowedByUserIdSuccess
 */
export interface SuccessResponseGetPageOfUsersFollowedByUserIdSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof SuccessResponseGetPageOfUsersFollowedByUserIdSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {GetPageOfUsersFollowedByUserIdSuccess}
   * @memberof SuccessResponseGetPageOfUsersFollowedByUserIdSuccess
   */
  success: GetPageOfUsersFollowedByUserIdSuccess;
}
