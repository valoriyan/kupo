import { RenderableUser } from "../user/models";

export enum NotificationType {
  NEW_FOLLOWER = "NEW_FOLLOWER",
  NEW_COMMENT = "NEW_COMMENT",
  NEW_LIKE_ON_POST = "NEW_LIKE_ON_POST",
  NEW_CLIENT_PURCHASE = "NEW_CLIENT_PURCHASE",
  NEW_COLLABORATION = "NEW_COLLABORATION",
}

export interface BaseNotification {
  type: NotificationType;
  timestamp: number;
}

export interface RenderableNewFollowerNotification extends BaseNotification {
  userDoingFollowing: RenderableUser;
}

export type RenderableNotification = RenderableNewFollowerNotification;
