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
import { GetPublishedItemsFromFollowedUsersSuccess } from "./get-published-items-from-followed-users-success";

/**
 *
 * @export
 * @interface SuccessResponseGetPublishedItemsFromFollowedUsersSuccess
 */
export interface SuccessResponseGetPublishedItemsFromFollowedUsersSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof SuccessResponseGetPublishedItemsFromFollowedUsersSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {GetPublishedItemsFromFollowedUsersSuccess}
   * @memberof SuccessResponseGetPublishedItemsFromFollowedUsersSuccess
   */
  success: GetPublishedItemsFromFollowedUsersSuccess;
}
