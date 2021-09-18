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

export interface UnrenderablePostWithoutElements {
  postId: string;
  postAuthorUserId: string;
  caption: string;
  title?: string;
  price?: number;
  scheduledPublicationTimestamp: number;
}

export interface RenderablePost extends UnrenderablePostWithoutElements {
  contentElements: RenderablePostContentElement[];
}
