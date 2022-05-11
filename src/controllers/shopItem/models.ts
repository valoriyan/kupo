import { MediaElement } from "../models";

export interface UnrenderableShopItemPreview {
  shopItemId: string;
  authorUserId: string;
  description: string;
  creationTimestamp: number;
  scheduledPublicationTimestamp: number;
  expirationTimestamp?: number;
  title: string;
  price: number;
}

export interface RenderableShopItemPreview extends UnrenderableShopItemPreview {
  hashtags: string[];
  mediaElements: MediaElement[];

  // countSold: number;
  // collaboratorUserIds: string[];

  // likesCount: number;
  // tipsSum: number;
}
