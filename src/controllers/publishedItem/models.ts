export enum PublishedItemType {
  POST = "POST",
  SHOP_ITEM = "SHOP_ITEM",
}

export interface UncompiledBasePublishedItem {
  type: PublishedItemType;
  id: string;
  authorUserId: string;
  caption: string;
  creationTimestamp: number;
  scheduledPublicationTimestamp: number;
  expirationTimestamp?: number;
  idOfPublishedItemBeingShared?: string;
}

export interface BaseRenderablePublishedItem extends UncompiledBasePublishedItem {
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
