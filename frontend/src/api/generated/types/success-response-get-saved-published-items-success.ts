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
import { GetSavedPublishedItemsSuccess } from "./get-saved-published-items-success";

/**
 *
 * @export
 * @interface SuccessResponseGetSavedPublishedItemsSuccess
 */
export interface SuccessResponseGetSavedPublishedItemsSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof SuccessResponseGetSavedPublishedItemsSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {GetSavedPublishedItemsSuccess}
   * @memberof SuccessResponseGetSavedPublishedItemsSuccess
   */
  success: GetSavedPublishedItemsSuccess;
}