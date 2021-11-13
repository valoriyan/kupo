export interface ShopItemMediaElement {
  blobFileKey: string;
}

export interface UnrenderableShopItemPreview {
  shopItemId: string;
  authorUserId: string;
  caption: string;
  title: string;
  price: number;
  scheduledPublicationTimestamp: number;
  expirationTimestamp?: number;
}

export interface RenderableShopItemPreview extends UnrenderableShopItemPreview {
  countSold: number;

  hashtags: string[];
  collaboratorUserIds: string[];

  likesCount: number;
  tipsSum: number;
}
