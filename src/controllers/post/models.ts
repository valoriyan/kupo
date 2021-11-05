import { RenderableDateTime } from "../models";

export interface BaseUnrenderablePost {
  postId: string;
  postAuthorUserId: string;
  caption: string;
}

export interface UnrenderablePostWithoutRenderableDatesTimesElementsOrHashtags
  extends BaseUnrenderablePost {
  scheduledPublicationTimestamp: number;
  expirationTimestamp?: number;
}

export interface UnrenderablePostWithoutElementsOrHashtags extends BaseUnrenderablePost {
  scheduledPublicationDateTime: RenderableDateTime;
  expirationDateTime?: RenderableDateTime;
}

export interface RenderablePost extends UnrenderablePostWithoutElementsOrHashtags {
  contentElementTemporaryUrls: string[];
  hashtags: string[];
}
