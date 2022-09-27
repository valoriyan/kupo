export enum UserContentFeedFilterType {
  HASHTAG = "HASHTAG",
  USERNAME = "USERNAME",
  COMMUNITY = "COMMUNITY",
  FOLLOWING_USERS = "FOLLOWING_USERS",
  ALL_POSTS_FOR_ADMINS = "ALL_POSTS_FOR_ADMINS",
}

export interface UserContentFeedFilter {
  contentFeedFilterId: string;
  userId: string;
  type: UserContentFeedFilterType;
  value: string;
  creationTimestamp: number;
}
