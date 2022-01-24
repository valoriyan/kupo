export interface BaseUnrenderablePost {
  postId: string;
  authorUserId: string;
  caption: string;
  creationTimestamp: number;
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
  comments: {
    count: number;
  };
  isLikedByClient: boolean;
}
