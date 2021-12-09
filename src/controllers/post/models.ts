export interface BaseUnrenderablePost {
  postId: string;
  authorUserId: string;
  caption: string;
}

export interface UnrenderablePostWithoutElementsOrHashtags extends BaseUnrenderablePost {
  scheduledPublicationTimestamp: number;
  expirationTimestamp?: number;
}

export interface RenderablePost extends UnrenderablePostWithoutElementsOrHashtags {
  contentElementTemporaryUrls: string[];
  hashtags: string[];
  likes: {
    count: number;
  };
  isLikedByClient: boolean;
}
