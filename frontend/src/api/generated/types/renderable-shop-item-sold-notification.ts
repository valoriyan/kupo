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

import { NOTIFICATIONEVENTSSHOPITEMSOLD } from "./notificationeventsshopitemsold";
import { RenderableShopItem } from "./renderable-shop-item";
import { RenderableUser } from "./renderable-user";

/**
 *
 * @export
 * @interface RenderableShopItemSoldNotification
 */
export interface RenderableShopItemSoldNotification {
  /**
   *
   * @type {NOTIFICATIONEVENTSSHOPITEMSOLD}
   * @memberof RenderableShopItemSoldNotification
   */
  type: NOTIFICATIONEVENTSSHOPITEMSOLD;
  /**
   *
   * @type {number}
   * @memberof RenderableShopItemSoldNotification
   */
  countOfUnreadNotifications: number;
  /**
   *
   * @type {number}
   * @memberof RenderableShopItemSoldNotification
   */
  eventTimestamp: number;
  /**
   *
   * @type {number}
   * @memberof RenderableShopItemSoldNotification
   */
  timestampSeenByUser?: number;
  /**
   *
   * @type {RenderableUser}
   * @memberof RenderableShopItemSoldNotification
   */
  purchaser: RenderableUser;
  /**
   *
   * @type {RenderableShopItem}
   * @memberof RenderableShopItemSoldNotification
   */
  shopItem: RenderableShopItem;
}
