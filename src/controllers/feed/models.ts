export enum UserContentFeedFilterType {
  HASHTAG = "HASHTAG",
  USERNAME = "USERNAME",
  FOLLOWING_USERS = "FOLLOWING_USERS",

  ALL_POSTS_FOR_REVIEW_BY_ADMINS = "ALL_POSTS_FOR_ADMINS",
}

export interface UserContentFeedFilter {
  contentFeedFilterId: string;
  userId: string;
  type: UserContentFeedFilterType;
  value: string;
  creationTimestamp: number;
}
