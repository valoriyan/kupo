export interface BaseUnrenderablePost {
  postId: string;
  postAuthorUserId: string;
  caption: string;
}

export interface UnrenderablePostWithoutElementsOrHashtags extends BaseUnrenderablePost {
  scheduledPublicationTimestamp: number;
  expirationTimestamp?: number;
}

export interface RenderablePost extends UnrenderablePostWithoutElementsOrHashtags {
  contentElementTemporaryUrls: string[];
  hashtags: string[];
}
