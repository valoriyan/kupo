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

import { CreateShopItemSuccess } from "./create-shop-item-success";
import { EitherTypeSuccess } from "./either-type-success";

/**
 *
 * @export
 * @interface SuccessResponseCreateShopItemSuccess
 */
export interface SuccessResponseCreateShopItemSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof SuccessResponseCreateShopItemSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {CreateShopItemSuccess}
   * @memberof SuccessResponseCreateShopItemSuccess
   */
  success: CreateShopItemSuccess;
}
