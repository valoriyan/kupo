export enum PostElementFileType {
  Image = "image",
  Video = "video",
}

export interface FiledPostContentElement {
  fileType: PostElementFileType;
  blobFileKey: string;
}

export interface RenderablePostContentElement {
  fileType: PostElementFileType;
  fileTemporaryUrl: string;
}

export interface UnrenderablePostWithoutElementsOrHashtags {
  postId: string;
  postAuthorUserId: string;
  caption: string;
  scheduledPublicationTimestamp: number;
  expirationTimestamp?: number;
}

export interface RenderablePost extends UnrenderablePostWithoutElementsOrHashtags {
  contentElements: RenderablePostContentElement[];
  hashtags: string[];
}
