import { MediaElement } from "../../models";
import { BaseRenderablePublishedItem, PublishedItemType } from "../models";

export enum RenderableShopItemType {
  SHOP_ITEM_PREVIEW = "SHOP_ITEM_PREVIEW",
  PURCHASED_SHOP_ITEM_DETAILS = "PURCHASED_SHOP_ITEM_DETAILS",
}

export interface BaseShopItem extends BaseRenderablePublishedItem {
  renderableShopItemType: RenderableShopItemType;
  title: string;
  price: number;
  previewMediaElements: MediaElement[];
}

export interface RootShopItemPreview extends BaseShopItem {
  renderableShopItemType: RenderableShopItemType.SHOP_ITEM_PREVIEW;
}

export interface RootPurchasedShopItemDetails extends BaseShopItem {
  renderableShopItemType: RenderableShopItemType.PURCHASED_SHOP_ITEM_DETAILS;
  purchasedMediaElements: MediaElement[];
}

export interface SharedShopItem extends BaseRenderablePublishedItem {
  type: PublishedItemType.SHOP_ITEM;
  sharedItem: RootShopItemPreview | RootPurchasedShopItemDetails;
}

export type RenderableShopItem =
  | RootShopItemPreview
  | RootPurchasedShopItemDetails
  | SharedShopItem;
