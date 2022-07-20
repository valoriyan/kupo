import { RenderableUser } from "../../user/models";

export interface UnrenderablePublishedItemComment {
  publishedItemCommentId: string;
  publishedItemId: string;
  text: string;
  authorUserId: string;
  creationTimestamp: number;
}

export interface RenderablePublishedItemComment extends UnrenderablePublishedItemComment {
  user: RenderableUser;
}
