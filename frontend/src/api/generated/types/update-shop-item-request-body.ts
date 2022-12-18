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

/**
 *
 * @export
 * @interface UpdateShopItemRequestBody
 */
export interface UpdateShopItemRequestBody {
  /**
   *
   * @type {string}
   * @memberof UpdateShopItemRequestBody
   */
  publishedItemId: string;
  /**
   *
   * @type {string}
   * @memberof UpdateShopItemRequestBody
   */
  description?: string;
  /**
   *
   * @type {string}
   * @memberof UpdateShopItemRequestBody
   */
  title?: string;
  /**
   *
   * @type {number}
   * @memberof UpdateShopItemRequestBody
   */
  price?: number;
  /**
   *
   * @type {number}
   * @memberof UpdateShopItemRequestBody
   */
  scheduledPublicationTimestamp?: number;
  /**
   *
   * @type {number}
   * @memberof UpdateShopItemRequestBody
   */
  expirationTimestamp?: number;
  /**
   *
   * @type {Array<string>}
   * @memberof UpdateShopItemRequestBody
   */
  collaboratorUserIds?: Array<string>;
  /**
   *
   * @type {Array<string>}
   * @memberof UpdateShopItemRequestBody
   */
  hashtags?: Array<string>;
}