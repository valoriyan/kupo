export enum FollowingStatus {
  is_following = "is_following",
  not_following = "not_following",
  pending = "pending",
}

export interface UnrenderableUserFollow {
  userFollowEventId: string;
  userIdDoingFollowing: string;
  userIdBeingFollowed: string;
  isPending: boolean;
  timestamp: number;
}
