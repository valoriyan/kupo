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

import { MediaElement } from "./media-element";
import { PublishedItemType } from "./published-item-type";
import { RenderableShopItemTypePURCHASEDSHOPITEMDETAILS } from "./renderable-shop-item-type-purchasedshopitemdetails";
import { RenderableUserFollowers } from "./renderable-user-followers";

/**
 *
 * @export
 * @interface RootPurchasedShopItemDetails
 */
export interface RootPurchasedShopItemDetails {
  /**
   *
   * @type {PublishedItemType}
   * @memberof RootPurchasedShopItemDetails
   */
  type: PublishedItemType;
  /**
   *
   * @type {string}
   * @memberof RootPurchasedShopItemDetails
   */
  id: string;
  /**
   *
   * @type {string}
   * @memberof RootPurchasedShopItemDetails
   */
  authorUserId: string;
  /**
   *
   * @type {string}
   * @memberof RootPurchasedShopItemDetails
   */
  caption: string;
  /**
   *
   * @type {number}
   * @memberof RootPurchasedShopItemDetails
   */
  creationTimestamp: number;
  /**
   *
   * @type {number}
   * @memberof RootPurchasedShopItemDetails
   */
  scheduledPublicationTimestamp: number;
  /**
   *
   * @type {number}
   * @memberof RootPurchasedShopItemDetails
   */
  expirationTimestamp?: number;
  /**
   *
   * @type {string}
   * @memberof RootPurchasedShopItemDetails
   */
  idOfPublishedItemBeingShared?: string;
  /**
   *
   * @type {Array<string>}
   * @memberof RootPurchasedShopItemDetails
   */
  hashtags: Array<string>;
  /**
   *
   * @type {RenderableUserFollowers}
   * @memberof RootPurchasedShopItemDetails
   */
  likes: RenderableUserFollowers;
  /**
   *
   * @type {RenderableUserFollowers}
   * @memberof RootPurchasedShopItemDetails
   */
  comments: RenderableUserFollowers;
  /**
   *
   * @type {boolean}
   * @memberof RootPurchasedShopItemDetails
   */
  isLikedByClient: boolean;
  /**
   *
   * @type {boolean}
   * @memberof RootPurchasedShopItemDetails
   */
  isSavedByClient: boolean;
  /**
   *
   * @type {RenderableShopItemTypePURCHASEDSHOPITEMDETAILS}
   * @memberof RootPurchasedShopItemDetails
   */
  renderableShopItemType: RenderableShopItemTypePURCHASEDSHOPITEMDETAILS;
  /**
   *
   * @type {string}
   * @memberof RootPurchasedShopItemDetails
   */
  title: string;
  /**
   *
   * @type {number}
   * @memberof RootPurchasedShopItemDetails
   */
  price: number;
  /**
   *
   * @type {Array<MediaElement>}
   * @memberof RootPurchasedShopItemDetails
   */
  mediaElements: Array<MediaElement>;
  /**
   *
   * @type {RenderableUserFollowers}
   * @memberof RootPurchasedShopItemDetails
   */
  purchasedMediaElementsMetadata: RenderableUserFollowers;
  /**
   *
   * @type {Array<MediaElement>}
   * @memberof RootPurchasedShopItemDetails
   */
  purchasedMediaElements: Array<MediaElement>;
}
