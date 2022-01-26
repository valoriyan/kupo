export enum UserContentFeedFilterType {
  HASHTAG = "HASHTAG",
  USERNAME = "USERNAME",
  FOLLOWING_USERS = "FOLLOWING_USERS",
}

export interface UserContentFeedFilter {
  contentFeedFilterId: string;
  userId: string;
  type: UserContentFeedFilterType;
  value: string;
  creationTimestamp: number;
}
