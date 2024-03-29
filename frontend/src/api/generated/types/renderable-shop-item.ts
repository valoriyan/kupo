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

import { MediaElement } from "./media-element";
import { PublishedItemHost } from "./published-item-host";
import { PublishedItemTypeSHOPITEM } from "./published-item-type-shopitem";
import { RenderableShopItemTypePURCHASEDSHOPITEMDETAILS } from "./renderable-shop-item-type-purchasedshopitemdetails";
import { RenderableUserFollowers } from "./renderable-user-followers";
import { RootPurchasedShopItemDetails } from "./root-purchased-shop-item-details";
import { RootShopItemPreview } from "./root-shop-item-preview";
import { SharedShopItem } from "./shared-shop-item";

/**
 *
 * @export
 * @interface RenderableShopItem
 */
export interface RenderableShopItem {
  /**
   *
   * @type {PublishedItemTypeSHOPITEM}
   * @memberof RenderableShopItem
   */
  type: PublishedItemTypeSHOPITEM;
  /**
   *
   * @type {string}
   * @memberof RenderableShopItem
   */
  id: string;
  /**
   *
   * @type {string}
   * @memberof RenderableShopItem
   */
  authorUserId: string;
  /**
   *
   * @type {string}
   * @memberof RenderableShopItem
   */
  caption: string;
  /**
   *
   * @type {number}
   * @memberof RenderableShopItem
   */
  creationTimestamp: number;
  /**
   *
   * @type {number}
   * @memberof RenderableShopItem
   */
  scheduledPublicationTimestamp: number;
  /**
   *
   * @type {number}
   * @memberof RenderableShopItem
   */
  expirationTimestamp?: number;
  /**
   *
   * @type {string}
   * @memberof RenderableShopItem
   */
  idOfPublishedItemBeingShared?: string;
  /**
   *
   * @type {PublishedItemHost}
   * @memberof RenderableShopItem
   */
  host: PublishedItemHost;
  /**
   *
   * @type {Array<string>}
   * @memberof RenderableShopItem
   */
  hashtags: Array<string>;
  /**
   *
   * @type {RenderableUserFollowers}
   * @memberof RenderableShopItem
   */
  likes: RenderableUserFollowers;
  /**
   *
   * @type {RenderableUserFollowers}
   * @memberof RenderableShopItem
   */
  comments: RenderableUserFollowers;
  /**
   *
   * @type {boolean}
   * @memberof RenderableShopItem
   */
  isLikedByClient: boolean;
  /**
   *
   * @type {boolean}
   * @memberof RenderableShopItem
   */
  isSavedByClient: boolean;
  /**
   *
   * @type {RenderableShopItemTypePURCHASEDSHOPITEMDETAILS}
   * @memberof RenderableShopItem
   */
  renderableShopItemType: RenderableShopItemTypePURCHASEDSHOPITEMDETAILS;
  /**
   *
   * @type {string}
   * @memberof RenderableShopItem
   */
  title: string;
  /**
   *
   * @type {number}
   * @memberof RenderableShopItem
   */
  price: number;
  /**
   *
   * @type {Array<MediaElement>}
   * @memberof RenderableShopItem
   */
  mediaElements: Array<MediaElement>;
  /**
   *
   * @type {RenderableUserFollowers}
   * @memberof RenderableShopItem
   */
  purchasedMediaElementsMetadata: RenderableUserFollowers;
  /**
   *
   * @type {Array<MediaElement>}
   * @memberof RenderableShopItem
   */
  purchasedMediaElements: Array<MediaElement>;
  /**
   *
   * @type {RootShopItemPreview | RootPurchasedShopItemDetails}
   * @memberof RenderableShopItem
   */
  sharedItem: RootShopItemPreview | RootPurchasedShopItemDetails;
}
