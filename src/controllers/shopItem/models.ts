export interface UnrenderableShopItemPreview {
  numberOfElements: number;

  id: string;
  authorUserId: string;
  caption: string;
  title: string;
  price: number;
  scheduledPublicationTimestamp: number;
  expirationTimestamp?: number;

  countSold: number;

  hashtags: string[];
  collaboratorUserIds: string[];

  likesCount: number;
  tipsSum: number;
}
