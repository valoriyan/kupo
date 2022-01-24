import { RenderablePostComment } from "../../../controllers/postComment/models";
import { RenderablePost } from "../../../controllers/post/models";
import { RenderableUser } from "../../../controllers/user/models";

export interface NewLikeOnPostNotification {
  userThatLikedPost: RenderableUser;
  post: RenderablePost;
}

export interface NewMentionInPostNotification {
  userThatMentionedClient: RenderableUser;
  post: RenderablePost;
}

export interface NewMentionInPostCommentNotification {
  userThatMentionedClient: RenderableUser;
  post: RenderablePost;
  commentWithinPost: RenderablePostComment;
}
