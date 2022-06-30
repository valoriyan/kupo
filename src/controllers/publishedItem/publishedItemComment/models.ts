import { RenderableUser } from "../../user/models";

export interface UnrenderablePostComment {
  postCommentId: string;
  postId: string;
  text: string;
  authorUserId: string;
  creationTimestamp: number;
}

export interface RenderablePostComment extends UnrenderablePostComment {
  user: RenderableUser;
}
