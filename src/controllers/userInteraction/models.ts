export interface UnrenderableUserFollow {
  userFollowEventId: string;
  userIdDoingFollowing: string;
  userIdBeingFollowed: string;
  timestamp: number;
}

export enum SavedItemType {
  post = "post",
  shop_item = "shop_item",
}