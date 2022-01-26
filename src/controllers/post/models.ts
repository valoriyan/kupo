export enum SharedPostType {
  post = "post",
}

export interface UnrenderablePostWithoutElementsOrHashtags {
  postId: string;
  authorUserId: string;
  caption: string;
  creationTimestamp: number;
  scheduledPublicationTimestamp: number;
  expirationTimestamp?: number;
  sharedPostId?: string;
}

export interface UnrenderablePost extends UnrenderablePostWithoutElementsOrHashtags {
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

export interface RenderablePost extends UnrenderablePost {
  shared?: {
    type: SharedPostType;
    post: UnrenderablePost;
  };
}
