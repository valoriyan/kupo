import { RenderablePost } from "./post/models";
import { RenderableShopItem } from "./shopItem/models";

export enum PublishedItemType {
  POST = "POST",
  SHOP_ITEM = "SHOP_ITEM",
}

export interface PublishedItemPublishingChannelHost {
  publishingChannelId: string;
  name: string;
}

export type PublishedItemHost = PublishedItemPublishingChannelHost | "user-self-hosted";

export interface UnassembledBasePublishedItem {
  type: PublishedItemType;
  id: string;
  authorUserId: string;
  caption: string;
  creationTimestamp: number;
  scheduledPublicationTimestamp: number;
  expirationTimestamp?: number;
  idOfPublishedItemBeingShared?: string;
}

export interface BaseRenderablePublishedItem extends UnassembledBasePublishedItem {
  host: PublishedItemHost;
  hashtags: string[];
  likes: {
    count: number;
  };
  comments: {
    count: number;
  };
  isLikedByClient: boolean;
  isSavedByClient: boolean;
}

export type RenderablePublishedItem = RenderablePost | RenderableShopItem;
