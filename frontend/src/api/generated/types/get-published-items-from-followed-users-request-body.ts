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

import { PublishedItemType } from "./published-item-type";

/**
 *
 * @export
 * @interface GetPublishedItemsFromFollowedUsersRequestBody
 */
export interface GetPublishedItemsFromFollowedUsersRequestBody {
  /**
   *
   * @type {string}
   * @memberof GetPublishedItemsFromFollowedUsersRequestBody
   */
  cursor?: string;
  /**
   *
   * @type {number}
   * @memberof GetPublishedItemsFromFollowedUsersRequestBody
   */
  pageSize: number;
  /**
   *
   * @type {PublishedItemType}
   * @memberof GetPublishedItemsFromFollowedUsersRequestBody
   */
  publishedItemType?: PublishedItemType;
}
