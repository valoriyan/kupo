export enum UserContentFeedFilterType {
  HASHTAG = "HASHTAG",
  USERNAME = "USERNAME",
}

export interface UserContentFeedFilter {
  contentFeedFilterId: string;
  userId: string;
  type: UserContentFeedFilterType;
  value: string;
  creationTimestamp: number;
}
