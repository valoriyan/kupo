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
import { GetPageOfAllPublishedItemsSuccess } from "./get-page-of-all-published-items-success";

/**
 *
 * @export
 * @interface SuccessResponseGetPageOfAllPublishedItemsSuccess
 */
export interface SuccessResponseGetPageOfAllPublishedItemsSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof SuccessResponseGetPageOfAllPublishedItemsSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {GetPageOfAllPublishedItemsSuccess}
   * @memberof SuccessResponseGetPageOfAllPublishedItemsSuccess
   */
  success: GetPageOfAllPublishedItemsSuccess;
}
