export interface UnrenderablePostWithoutElementsOrHashtags {
  postId: string;
  postAuthorUserId: string;
  caption: string;
  scheduledPublicationTimestamp: number;
  expirationTimestamp?: number;
}

export interface RenderablePost extends UnrenderablePostWithoutElementsOrHashtags {
  contentElementTemporaryUrls: string[];
  hashtags: string[];
}
