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
 * @interface GetPublishedItemsScheduledByUserRequestBody
 */
export interface GetPublishedItemsScheduledByUserRequestBody {
  /**
   *
   * @type {number}
   * @memberof GetPublishedItemsScheduledByUserRequestBody
   */
  rangeStartTimestamp: number;
  /**
   *
   * @type {number}
   * @memberof GetPublishedItemsScheduledByUserRequestBody
   */
  rangeEndTimestamp: number;
  /**
   *
   * @type {PublishedItemType}
   * @memberof GetPublishedItemsScheduledByUserRequestBody
   */
  publishedItemType?: PublishedItemType;
}
