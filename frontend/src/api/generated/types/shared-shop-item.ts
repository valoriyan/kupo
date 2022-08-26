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

import { PublishedItemTypeSHOPITEM } from "./published-item-type-shopitem";
import { RenderableUserFollowers } from "./renderable-user-followers";
import { RootPurchasedShopItemDetails } from "./root-purchased-shop-item-details";
import { RootShopItemPreview } from "./root-shop-item-preview";

/**
 *
 * @export
 * @interface SharedShopItem
 */
export interface SharedShopItem {
  /**
   *
   * @type {PublishedItemTypeSHOPITEM}
   * @memberof SharedShopItem
   */
  type: PublishedItemTypeSHOPITEM;
  /**
   *
   * @type {string}
   * @memberof SharedShopItem
   */
  id: string;
  /**
   *
   * @type {string}
   * @memberof SharedShopItem
   */
  authorUserId: string;
  /**
   *
   * @type {string}
   * @memberof SharedShopItem
   */
  caption: string;
  /**
   *
   * @type {number}
   * @memberof SharedShopItem
   */
  creationTimestamp: number;
  /**
   *
   * @type {number}
   * @memberof SharedShopItem
   */
  scheduledPublicationTimestamp: number;
  /**
   *
   * @type {number}
   * @memberof SharedShopItem
   */
  expirationTimestamp?: number;
  /**
   *
   * @type {string}
   * @memberof SharedShopItem
   */
  idOfPublishedItemBeingShared?: string;
  /**
   *
   * @type {Array<string>}
   * @memberof SharedShopItem
   */
  hashtags: Array<string>;
  /**
   *
   * @type {RenderableUserFollowers}
   * @memberof SharedShopItem
   */
  likes: RenderableUserFollowers;
  /**
   *
   * @type {RenderableUserFollowers}
   * @memberof SharedShopItem
   */
  comments: RenderableUserFollowers;
  /**
   *
   * @type {boolean}
   * @memberof SharedShopItem
   */
  isLikedByClient: boolean;
  /**
   *
   * @type {boolean}
   * @memberof SharedShopItem
   */
  isSavedByClient: boolean;
  /**
   *
   * @type {RootShopItemPreview | RootPurchasedShopItemDetails}
   * @memberof SharedShopItem
   */
  sharedItem: RootShopItemPreview | RootPurchasedShopItemDetails;
}