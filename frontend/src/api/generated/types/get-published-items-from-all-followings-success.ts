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

import { RenderablePublishedItem } from "./renderable-published-item";

/**
 *
 * @export
 * @interface GetPublishedItemsFromAllFollowingsSuccess
 */
export interface GetPublishedItemsFromAllFollowingsSuccess {
  /**
   *
   * @type {Array<RenderablePublishedItem>}
   * @memberof GetPublishedItemsFromAllFollowingsSuccess
   */
  publishedItems: Array<RenderablePublishedItem>;
  /**
   *
   * @type {string}
   * @memberof GetPublishedItemsFromAllFollowingsSuccess
   */
  previousPageCursor?: string;
  /**
   *
   * @type {string}
   * @memberof GetPublishedItemsFromAllFollowingsSuccess
   */
  nextPageCursor?: string;
}